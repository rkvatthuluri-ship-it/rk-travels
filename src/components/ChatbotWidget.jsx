import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './ChatbotWidget.css';

const SYSTEM_PROMPT = `
You are the official AI Travel Assistant for "RK Travels", a premium cab service provider in Andhra Pradesh and Telangana.
Your goal is to answer customers' questions about cab rates, distances, travel packages, and bookings politely and concisely.

Business Rules & Context:
1. Services Offered:
   - Airport Pickup/Drop: Vijayawada Airport (Gannavaram), Hyderabad Airport (RGIA), Visakhapatnam, Rajahmundry.
   - Local City Rides: Flexible city packages.
   - Outstation Trips: One-way and round trips between major cities.
   - Temple Packages: Pancharamam temples, Vijayawada temples, Swarnagiri/Yadagirigutta.

2. Typical Rates & Pricing Structure (Estimates):
   - Outstation Trips (Minimum billing of 250 km per day):
     - Sedan (Dzire, Etios, etc.): ₹13 per km. Driver Beta: ₹300 per day.
     - SUV (Ertiga, Innova, etc.): ₹17 per km. Driver Beta: ₹400 per day.
     - Note: Toll charges, parking fees, and state permit taxes are extra and paid directly by the customer.
   - Local Packages:
     - 8 Hours / 80 Km: Sedan ~₹1,800, SUV ~₹2,600.
   - Airport Transfers (Est. one-way flat rates):
     - Vijayawada City to Vijayawada Airport (Gannavaram): Sedan ~₹800, SUV ~₹1,200.
     - Vijayawada to Hyderabad Airport (RGIA) (~290 km): Sedan ~₹4,500, SUV ~₹6,500.
     - Guntur to Hyderabad Airport (RGIA) (~280 km): Sedan ~₹4,300, SUV ~₹6,300.

3. Typical Route Distances:
   - Vijayawada to Hyderabad: ~280-290 km.
   - Vijayawada to Visakhapatnam: ~350 km.
   - Vijayawada to Guntur: ~35 km.
   - Vijayawada to Tirupathi: ~400 km.
   - Vijayawada to Chennai: ~430 km.

4. Guidelines for Tone and Restricting Domain:
   - Always be polite, friendly, and helpful.
   - Restrict your answers strictly to cab services, travel estimates, tourism packages in AP/Telangana, and RK Travels.
   - If asked questions outside of travel, tourism, or cabs (like programming, science, general news, or advice), politely decline: "I am only programmed to assist with RK Travels booking and travel questions."
   - Keep answers brief and conversational (maximum 2-3 sentences where possible).
   - If a customer wants to book, tell them: "You can book directly by clicking the 'Book Now' button on our services list or call Rama Krishna at +91 93910 89897."
   - Respond in the language that the user queries in (either English or Telugu).
`;

export default function ChatbotWidget() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // Load API key from local storage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('rk_travels_openrouter_key');
    if (savedKey) {
      setApiKey(savedKey);
      setApiKeyInput(savedKey);
    }

    // Insert greeting message based on language context
    setMessages([
      {
        role: 'assistant',
        content: t('Hello! I am your RK Travels AI assistant. Ask me anything about outstation/local cab rates, distances, or vehicle packages!')
      }
    ]);
  }, [language]);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !showSettings) {
      setTimeout(() => chatInputRef.current?.focus(), 300);
    }
  }, [isOpen, showSettings]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const cleanKey = apiKeyInput.trim();
    localStorage.setItem('rk_travels_openrouter_key', cleanKey);
    setApiKey(cleanKey);
    setShowSettings(false);
    
    // Add success system alert
    alert(t('API Key saved successfully!'));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    // Append user message
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);

    const backendUrl = import.meta.env.VITE_CHATBACKEND_URL || '';
    const activeKey = apiKey || import.meta.env.VITE_OPENROUTER_API_KEY || '';

    // If no backend is configured AND no client key exists, block and prompt
    if (!backendUrl && !activeKey) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: t('Please configure your OpenRouter API Key in the Chat Settings (gear icon in header) to start chatting.')
          }
        ]);
      }, 500);
      return;
    }

    setIsLoading(true);

    try {
      // Map message history to payload format
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      let response;
      if (backendUrl) {
        // Query secure FastAPI backend proxy
        response = await fetch(`${backendUrl.replace(/\/$/, '')}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: apiMessages
          })
        });
      } else {
        // Fallback to client-side direct OpenRouter query
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${activeKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'RK Travels Chatbot'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3-8b-instruct:free',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...apiMessages
            ]
          })
        });
      }

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const botResponse = backendUrl 
        ? data.content 
        : (data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t generate a response.');
      
      setMessages((prev) => [...prev, { role: 'assistant', content: botResponse }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I experienced a network issue. Please check your API key or connection and try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      {/* Floating Toggle Button */}
      <button
        className={`chat-widget__toggle ${isOpen ? 'chat-widget__toggle--active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle Travel Assistant"
        type="button"
      >
        {isOpen ? (
          <i className="fas fa-times chat-widget__toggle-icon" />
        ) : (
          <div className="chat-widget__toggle-inner">
            <i className="fas fa-robot chat-widget__toggle-icon" />
            <span className="chat-widget__badge" />
          </div>
        )}
      </button>

      {/* Chat Overlay Drawer */}
      {isOpen && (
        <div className="chat-widget__card">
          {/* Header */}
          <header className="chat-widget__header">
            <div className="chat-widget__header-left">
              <div className="chat-widget__avatar">
                <i className="fas fa-robot" />
                <span className="chat-widget__avatar-status" />
              </div>
              <div className="chat-widget__header-info">
                <h4 className="chat-widget__title">{t('RK Travels Assistant')}</h4>
                <span className="chat-widget__status">{t('Online')}</span>
              </div>
            </div>

            <div className="chat-widget__header-actions">
              <button
                className="chat-widget__header-btn"
                onClick={() => setShowSettings((prev) => !prev)}
                title={t('Chat Settings')}
                type="button"
                aria-label="Settings"
              >
                <i className="fas fa-cog" />
              </button>
              <button
                className="chat-widget__header-btn"
                onClick={() => setIsOpen(false)}
                title={t('Close Chat')}
                type="button"
                aria-label="Close"
              >
                <i className="fas fa-times" />
              </button>
            </div>
          </header>

          {/* Settings Sub-View */}
          {showSettings ? (
            <form className="chat-widget__settings" onSubmit={handleSaveSettings}>
              <h5 className="chat-widget__settings-title">{t('Chat Settings')}</h5>
              <p className="chat-widget__settings-desc">
                Paste your OpenRouter API Key below. This key is saved locally in your browser.
              </p>
              <div className="chat-widget__settings-field">
                <input
                  type="password"
                  className="chat-widget__settings-input"
                  placeholder={t('Enter OpenRouter API Key...')}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                />
              </div>
              <div className="chat-widget__settings-actions">
                <button className="chat-widget__settings-btn" type="submit">
                  {t('Save API Key')}
                </button>
                <button
                  className="chat-widget__settings-btn chat-widget__settings-btn--cancel"
                  type="button"
                  onClick={() => setShowSettings(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Message Display Area */}
              <div className="chat-widget__body">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-widget__msg-bubble chat-widget__msg-bubble--${msg.role}`}
                  >
                    <div className="chat-widget__msg-text">{msg.content}</div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isLoading && (
                  <div className="chat-widget__msg-bubble chat-widget__msg-bubble--assistant">
                    <div className="chat-widget__typing">
                      <span className="chat-widget__dot" />
                      <span className="chat-widget__dot" />
                      <span className="chat-widget__dot" />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Form */}
              <form className="chat-widget__footer" onSubmit={handleSend}>
                <input
                  ref={chatInputRef}
                  type="text"
                  className="chat-widget__input"
                  placeholder={t('Ask me about cab rates, distances, and bookings...')}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  className="chat-widget__send-btn"
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  aria-label="Send message"
                >
                  <i className="fas fa-paper-plane" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
