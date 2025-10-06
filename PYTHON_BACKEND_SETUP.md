# Connecting to Your Python Backend

This chatbot interface can replace your Gradio UI and connect directly to your Python backend.

## Backend Requirements

Your Python backend should expose an HTTP endpoint that:
- Accepts POST requests
- Receives JSON: `{"message": "user input"}`
- Returns JSON with one of these formats:
  - `{"response": "bot reply"}`
  - `{"text": "bot reply"}`
  - `{"message": "bot reply"}`

## Example Python Backend (Flask)

```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    
    # Your LLM logic here
    bot_response = your_llm_function(user_message)
    
    return jsonify({'response': bot_response})

if __name__ == '__main__':
    app.run(port=7860)
```

## Example Python Backend (FastAPI)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(msg: ChatMessage):
    # Your LLM logic here
    bot_response = your_llm_function(msg.message)
    return {"response": bot_response}
```

## Configuration

Update the endpoint in `src/lib/chat-api.ts`:

```typescript
export const chatAPI = new ChatAPI('http://localhost:7860/api/chat');
```

Replace `http://localhost:7860/api/chat` with your actual backend URL.

## Deployment

When deploying:
1. Deploy your Python backend (Hugging Face Spaces, Railway, etc.)
2. Update the endpoint URL in `chat-api.ts` with your deployed URL
3. Ensure CORS is enabled on your backend

## Testing

1. Start your Python backend
2. Update the endpoint URL in the code
3. Open the chatbot interface
4. Send a test message
5. Check browser console for connection logs
