// Chat API utilities for Rasa integration
// This file provides the interface for connecting to Rasa

// Generic chat API for connecting to any Python backend
export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  response?: string;
  text?: string;
  message?: string;
}

export class ChatAPI {
  private endpoint: string;

  constructor(endpoint: string = '/api/chat') {
    this.endpoint = endpoint;
  }

  // Set your Python backend endpoint
  setEndpoint(endpoint: string) {
    this.endpoint = endpoint;
  }

  // Send message to your Python backend
  async sendMessage(message: string): Promise<string> {
    const payload: ChatMessage = { message };

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      // Handle different response formats from Python backends
      return data.response || data.text || data.message || 'No response';
    } catch (error) {
      console.error('Error communicating with backend:', error);
      throw error;
    }
  }
}

// Configure this with your Python backend URL
export const chatAPI = new ChatAPI('http://localhost:7860/api/chat'); // Update with your backend URL