# Chatbot Setup Guide

This chatbot UI is ready to integrate with Rasa. Here's how to connect it to your Rasa server:

## 🚀 Production Integration

### 1. Replace Mock API with Real Rasa Connection

In `src/components/chat/ChatContainer.tsx`, uncomment the actual Rasa integration code and remove the mock API call:

```typescript
// Replace this:
const { simulateRasaCall } = await import('@/lib/mock-rasa-api');
return await simulateRasaCall(userMessage);

// With this:
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    sender: "user-123", // Use a unique user ID
    message: userMessage
  })
});
```

### 2. Create Edge Function

Create an edge function at `/api/chat` that forwards requests to your Rasa server:

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('YOUR_RASA_ENDPOINT_HERE', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to connect to Rasa' });
  }
}
```

### 3. Update Rasa Endpoint

Use the `ChatAPI` class in `src/lib/chat-api.ts` to easily switch endpoints:

```typescript
import { chatAPI } from '@/lib/chat-api';

// Set your production Rasa endpoint
chatAPI.setEndpoint('https://your-rasa-server.com/webhooks/rest/webhook');
```

## 🎨 Customization

### Colors & Styling
- Edit `src/index.css` to customize the color scheme
- Modify chat bubble styles in `src/components/chat/ChatBubble.tsx`
- Adjust the design system tokens for brand consistency

### Features
- Add file upload support
- Implement message reactions
- Add typing indicators
- Include message history persistence
- Add user authentication

## 📱 Mobile Optimization

The UI is already mobile-responsive with:
- Touch-friendly chat bubbles
- Optimized input field
- Proper viewport sizing
- Smooth scrolling animations

## 🔧 Configuration

Key files for configuration:
- `src/lib/chat-api.ts` - API endpoints and settings
- `src/components/chat/ChatContainer.tsx` - Main chat logic
- `src/index.css` - Design system and colors