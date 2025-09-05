import React from 'react';
import ChatbotClient from './ChatbotClient';

const Chatbot: React.FC = () => {
  // Your Gemini API key - ideally this should come from environment variables
  const GEMINI_API_KEY = 'AIzaSyApmL8oaGmW4eGOekMGn7364TpufudT3y4';

  return <ChatbotClient apiKey={GEMINI_API_KEY} />;
};

export default Chatbot;