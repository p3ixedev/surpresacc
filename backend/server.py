from fastapi import FastAPI, APIRouter
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import json
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

# Integração ChatGPT (OpenAI gpt-6-luna) via Emergent LLM Key.
# Backend-only: pronta para uso futuro; nenhum recurso de IA aparece no site.
# POST /api/ai/generate  body: {"prompt": "...", "session_id": "opcional"}
# Resposta: Server-Sent Events com tokens {"delta": ...} e, ao final, {"done": true}.
class AiGenerateRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=4000)
    session_id: str = "cecilia-ai"

@api_router.post("/ai/generate")
async def ai_generate(body: AiGenerateRequest):
    from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=body.session_id,
        system_message="Você é um assistente criativo que escreve em português do Brasil, com carinho e naturalidade.",
    ).with_model("openai", "gpt-6-luna")

    async def event_stream():
        try:
            async for ev in chat.stream_message(UserMessage(text=body.prompt)):
                if isinstance(ev, TextDelta):
                    yield f"data: {json.dumps({'delta': ev.content}, ensure_ascii=False)}\n\n"
                elif isinstance(ev, StreamDone):
                    yield 'data: {"done": true}\n\n'
                    break
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)}, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()