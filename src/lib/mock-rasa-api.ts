// Mock API to simulate Rasa responses for development/demo
// This can be easily replaced with real edge function when deployed

export const mockRasaResponses = [
  "I understand you're looking for help. What specific topic would you like to discuss?",
  "That's interesting! Can you tell me more about what you're trying to achieve?",
  "I'm here to assist you. Feel free to ask me anything!",
  "Based on what you've shared, I think I can help you with that.",
  "Let me process that information and provide you with the best assistance possible.",
  "Thanks for sharing that with me. How else can I support you today?",
  "I appreciate your question. Here's what I think might be helpful...",
  "That's a great question! Let me break this down for you.",
];

export const simulateRasaCall = async (userMessage: string): Promise<string[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Simple response logic based on user input
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return ["Hello! Nice to meet you. How can I assist you today?"];
  }
  
  if (lowerMessage.includes('help')) {
    return [
      "I'm here to help! I can assist with various topics and questions.",
      "What specific area would you like help with?"
    ];
  }
  
  if (lowerMessage.includes('thank')) {
    return ["You're very welcome! Is there anything else I can help you with?"];
  }
  
  if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
    return ["Goodbye! Feel free to come back anytime if you need assistance."];
  }
  
  // Default response with some variation
  const randomIndex = Math.floor(Math.random() * mockRasaResponses.length);
  return [mockRasaResponses[randomIndex]];
};