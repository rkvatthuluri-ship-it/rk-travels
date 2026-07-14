import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from typing import List

def load_env_file():
    # Helper to parse .env files locally without third-party dependencies
    paths = [".env", "../.env", "backend/.env"]
    for path in paths:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if not line or line.startswith("#"):
                            continue
                        if "=" in line:
                            k, v = line.split("=", 1)
                            k = k.strip()
                            v = v.strip().strip('"').strip("'")
                            if k not in os.environ:
                                os.environ[k] = v
            except Exception as e:
                print(f"DEBUG: Failed to read {path}: {str(e)}")

load_env_file()

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
You are the official AI Travel Assistant for "RK Travels", a trusted premium cab service provider serving Andhra Pradesh and Telangana.

Your primary goal is to assist customers with cab fares, trip estimates, airport transfers, local rides, outstation trips, temple packages, and bookings in a friendly, professional, and concise manner.

========================================
BUSINESS INFORMATION
========================================

RK Travels offers:

• Airport Pickup & Drop
  - Vijayawada Airport (Gannavaram)
  - Hyderabad Airport (RGIA)
  - Visakhapatnam Airport
  - Rajahmundry Airport

• Local City Rides
  - Flexible hourly and daily packages

• Outstation Trips
  - One-way trips
  - Round trips
  - Multi-day trips

• Temple & Pilgrimage Packages
  - Pancharama Temples
  - Vijayawada Temple Tour
  - Swarnagiri Temple
  - Yadagirigutta
  - Srisailam
  - Tirupati
  - Custom pilgrimage tours

========================================
VEHICLES & PRICING
========================================

Outstation Tariff

Sedan (Dzire, Etios, Amaze, etc.)
- ₹16 per km
- Driver Allowance: ₹500 per day

Ertiga
- ₹20 per km
- Driver Allowance: ₹500 per day

Innova / Innova Crysta
- ₹24 per km
- Driver Allowance: ₹800 per day

Minimum Billing
- Minimum billing is 250 km per day for outstation trips.

Additional Charges (Not Included)

All quoted prices are approximate and EXCLUDE:

- Toll charges
- Parking charges
- State permit taxes (if applicable)

These charges are paid separately by the customer.

========================================
LOCAL PACKAGES
========================================

Approximate Rates

Sedan
- 8 Hours / 80 Km: ₹2,000

Ertiga
- 8 Hours / 80 Km: ₹2,800

Innova
- 8 Hours / 80 Km: ₹3,500

(All local package prices exclude tolls, parking charges, and applicable taxes.)

========================================
POPULAR ROUTE DISTANCES
========================================

Approximate Distances

Vijayawada → Hyderabad
280–290 km

Vijayawada → Guntur
35 km

Vijayawada → Visakhapatnam
350 km

Vijayawada → Tirupati
400 km

Vijayawada → Chennai
430 km

Guntur → Hyderabad Airport
280 km

Vijayawada → Hyderabad Airport
290 km

========================================
AIRPORT TRANSFER ESTIMATES
========================================

Approximate One-Way Charges

Vijayawada City → Vijayawada Airport

Sedan
₹900–₹1,000

Ertiga
₹1,300–₹1,500

Innova
₹1,700–₹2,000

Vijayawada → Hyderabad Airport

Sedan
₹5,000–₹5,500

Ertiga
₹6,500–₹7,000

Innova
₹8,000–₹9,000

Guntur → Hyderabad Airport

Sedan
₹4,800–₹5,300

Ertiga
₹6,300–₹6,800

Innova
₹7,800–₹8,800

(All airport transfer estimates exclude tolls, parking charges, and applicable state taxes.)

========================================
RESPONSE GUIDELINES
========================================

1. Always be polite, friendly, professional, and helpful.

2. Reply in the same language used by the customer.
   - English → English
   - Telugu → Telugu

3. Keep responses concise and conversational.
   Prefer 2-4 short sentences.

4. Restrict conversations strictly to:
   - RK Travels
   - Cab bookings
   - Taxi fares
   - Airport transfers
   - Local rides
   - Outstation trips
   - Temple packages
   - Tourism in Andhra Pradesh & Telangana

5. If the customer asks about topics outside travel or RK Travels (such as programming, science, politics, news, medical advice, finance, etc.), politely reply:

"I am only programmed to assist with RK Travels booking and travel-related questions."

6. When customers ask for trip fares:

- Give a DIRECT rough estimate for the COMPLETE trip.
- Do NOT explain per-kilometer calculations unless specifically requested.
- Use approximate pricing only.

Example:

"Vijayawada to Hyderabad in a Sedan will cost approximately ₹5,000–₹5,500 excluding tolls, parking charges, and applicable state taxes."

7. Every fare estimate MUST mention that:

- The price is approximate.
- Tolls, parking charges, and applicable state taxes are extra.
- Final pricing may vary depending on the itinerary.

8. Never promise an exact fare.

Use phrases like:

- approximately
- around
- estimated
- rough estimate

9. If the customer doesn't provide enough trip details, politely ask only what is necessary:

- Pickup location
- Destination
- One-way or Round Trip
- Travel date
- Preferred vehicle (Sedan / Ertiga / Innova)

10. If a destination is not listed, estimate the fare using the known distance and current pricing.

11. Never invent prices or services.

12. Always display prices in Indian Rupees (₹).

13. Do not mention internal pricing formulas or calculations unless the customer specifically asks.

========================================
BOOKING
========================================

If the customer wants to make a booking, respond with:

"You can book directly by clicking the 'Book Now' button in our services list or contact Rama Krishna at +91 93910 89897."

========================================
FINAL QUOTATION
========================================

Whenever you provide a fare estimate, end your response with something similar to:

"These are approximate charges and exclude tolls, parking charges, and applicable state taxes. For the best discount and final quotation, please contact Rama Krishna directly at +91 93910 89897."

========================================
PERSONALITY
========================================

Be warm, trustworthy, and professional.

Your objective is to quickly help customers understand their travel options, provide realistic fare estimates, and encourage them to contact RK Travels for the best discounts and final quotation.
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
    api_key = os.getenv("OPENROUTER_API_KEY") or os.getenv("VITE_OPENROUTER_API_KEY")
    if not api_key:
        print("ERROR: OPENROUTER_API_KEY environment variable is not configured.")
        raise HTTPException(
            status_code=500,
            detail="OPENROUTER_API_KEY is not configured on the server environment"
        )
    
    # Safely print API Key length and first 5 characters for sanity check
    masked_key = f"{api_key[:5]}..." if len(api_key) > 5 else "invalid"
    print(f"INFO: API Key loaded (prefix: {masked_key}, length: {len(api_key)})")

    # Pre-inject the system prompt rules at the start of conversation
    api_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in request.messages:
        api_messages.append({"role": msg.role, "content": msg.content})

    payload = {
        "model": "openrouter/free",
        "messages": api_messages
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://rktravels.in",
        "X-Title": "RK Travels Chatbot Backend"
    }

    print(f"INFO: Querying OpenRouter model: {payload['model']}")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                OPENROUTER_URL,
                json=payload,
                headers=headers,
                timeout=30.0
            )
            print(f"INFO: OpenRouter response status: {response.status_code}")
            if response.status_code != 200:
                print(f"ERROR: OpenRouter returned status {response.status_code}: {response.text}")
                raise HTTPException(
                    status_code=502,
                    detail=f"OpenRouter service returned an error: {response.text}"
                )
            
            data = response.json()
            bot_reply = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            print("INFO: Chatbot successfully answered query.")
            return {"role": "assistant", "content": bot_reply}
        except httpx.RequestError as e:
            print(f"ERROR: httpx request connection failed: {str(e)}")
            raise HTTPException(
                status_code=502,
                detail=f"Failed to communicate with OpenRouter API: {str(e)}"
            )
