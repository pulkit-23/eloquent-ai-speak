import { useEffect, useRef, useState } from "react";
import { ChatBubble, type Message } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Bot, MessageCircle } from "lucide-react";

export const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth", 
      block: "end" 
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateUniqueId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const sendToRasa = async (userMessage: string): Promise<string[]> => {
    try {
      // For demo purposes, we'll use the mock API
      // In production, replace this with actual Rasa endpoint
      const { simulateRasaCall } = await import('@/lib/mock-rasa-api');
      return await simulateRasaCall(userMessage);
      
      // Uncomment below for actual Rasa integration:
      /*
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: "user-123", // In real app, this would be a unique user ID
          message: userMessage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chat service');
      }

      const botMessages = await response.json();
      return botMessages.map((msg: any) => msg.text || "Sorry, I couldn't process that.");
      */
    } catch (error) {
      console.error('Error sending message to Rasa:', error);
      return ["I'm sorry, I'm having trouble processing your request right now. Please try again in a moment."];
    }
  };

  const handleSendMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: generateUniqueId(),
      text: messageText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const botResponses = await sendToRasa(messageText);
      
      // Add each bot response as a separate message
      botResponses.forEach((responseText, index) => {
        setTimeout(() => {
          const botMessage: Message = {
            id: generateUniqueId(),
            text: responseText,
            sender: "bot",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
        }, index * 500); // Stagger responses for better UX
      });
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">Always here to help</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-bot-message text-bot-message-foreground px-4 py-3 rounded-2xl max-w-[200px] shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
                         style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
                         style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
                         style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading}
      />
    </div>
  );
};