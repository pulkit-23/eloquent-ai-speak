// Chat API utilities for Rasa integration
// This file provides the interface for connecting to Rasa

export interface RasaMessage {
  sender: string;
  message: string;
}

export interface RasaResponse {
  text?: string;
  custom?: any;
}

export class ChatAPI {
  private rasaEndpoint: string;

  constructor(endpoint: string = 'http://localhost:5005/webhooks/rest/webhook') {
    this.rasaEndpoint = endpoint;
  }

  // Set a new endpoint (useful for switching between local and deployed)
  setEndpoint(endpoint: string) {
    this.rasaEndpoint = endpoint;
  }

  // Send message to Rasa and get response
  async sendMessage(sender: string, message: string): Promise<RasaResponse[]> {
    const payload: RasaMessage = {
      sender,
      message
    };

    try {
      const response = await fetch(this.rasaEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RasaResponse[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error communicating with Rasa:', error);
      throw error;
    }
  }

  // Test connection to Rasa server
  async testConnection(): Promise<boolean> {
    try {
      await this.sendMessage('test-user', 'hello');
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Singleton instance for the app
export const chatAPI = new ChatAPI();