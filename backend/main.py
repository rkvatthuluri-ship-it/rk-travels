import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from typing import List

app = FastAPI(title="RK Travels Chatbot API")

# Enable Cross-Origin Resource Sharing (CORS)
# Allows requests from the React frontend running on GitHub Pages
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

SYSTEM_PROMPT = """
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
"""

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

@app.get("/")
def read_root():
    return {"status": "online", "service": "RK Travels Chatbot API"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OPENROUTER_API_KEY is not configured on the server environment"
        )
    
    # Pre-inject the system prompt rules at the start of conversation
    api_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in request.messages:
        api_messages.append({"role": msg.role, "content": msg.content})

    payload = {
        "model": "meta-llama/llama-3-8b-instruct:free",
        "messages": api_messages
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://rktravels.in",
        "X-Title": "RK Travels Chatbot Backend"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                OPENROUTER_URL,
                json=payload,
                headers=headers,
                timeout=30.0
            )
            if response.status_code != 200:
                raise HTTPException(
                    status_code=502,
                    detail=f"OpenRouter service returned an error: {response.text}"
                )
            
            data = response.json()
            bot_reply = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            return {"role": "assistant", "content": bot_reply}
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=502,
                detail=f"Failed to communicate with OpenRouter API: {str(e)}"
            )
