import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={cn(
      "flex w-full animate-in slide-in-from-bottom-2 duration-300",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm",
        "transition-all duration-300 hover:shadow-md",
        isUser 
          ? "bg-gradient-to-r from-user-message to-user-message/90 text-user-message-foreground ml-4" 
          : "bg-gradient-to-r from-bot-message to-bot-message/95 text-bot-message-foreground mr-4"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.text}
        </p>
        <div className={cn(
          "text-xs mt-2 opacity-70",
          isUser ? "text-right" : "text-left"
        )}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};