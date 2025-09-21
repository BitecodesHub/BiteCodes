"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Minimize2, Maximize2, Bot, User, Sparkles, Trash2, Crown, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotClientProps {
  apiKey: string;
}

const ChatbotClient: React.FC<ChatbotClientProps> = ({ apiKey }) => {
  const { isPremiumUser, loading, isLoggedIn } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const STORAGE_KEY = 'ai-chatbot-messages';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Load messages from localStorage on component mount
  useEffect(() => {
    if (!isPremiumUser()) return; // Skip for non-premium users

    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(parsedMessages);
      } else {
        // Set initial welcome message
        const welcomeMessage: Message = {
          id: '1',
          content: "Hi! I'm your AI assistant powered by Bitecodes. How can I help you today?",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([welcomeMessage]));
      }
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
      const welcomeMessage: Message = {
        id: '1',
        content: "Hi! I'm your AI assistant powered by Bitecodes. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isPremiumUser]);

  // Save messages to localStorage whenever messages change
  const saveToLocalStorage = (newMessages: Message[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  };

  // Function to format message content with markdown-like syntax
  const formatMessageContent = (content: string) => {
    // Handle bold text with **
    let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Handle code blocks with ```
    formattedContent = formattedContent.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Handle inline code with `
    formattedContent = formattedContent.replace(/`(.*?)`/g, '<code>$1</code>');

    // Handle line breaks
    formattedContent = formattedContent.replace(/\n/g, '<br />');

    return { __html: formattedContent };
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveToLocalStorage(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: input.trim(),
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.candidates[0].content.parts[0].text,
          isUser: false,
          timestamp: new Date(),
        };

        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);
        saveToLocalStorage(finalMessages);
      } else {
        throw new Error('Invalid response format from Bitecodes AI API');
      }
    } catch (error) {
      console.error('Error calling Bitecodes AI API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize, but I'm having trouble connecting to the AI service right now. Please check your internet connection and try again. If the problem persists, the API key might need to be verified.",
        isUser: false,
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveToLocalStorage(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: "Hi! I'm your AI assistant powered by Bitecodes. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    saveToLocalStorage([welcomeMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Show loading state while checking premium status
  if (loading) {
    return (
      <div className="fixed bottom-6 right-6 w-11/12 max-w-md sm:max-w-lg md:max-w-xl lg:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking premium status...</p>
        </div>
      </div>
    );
  }

  // Show premium prompt for non-premium users
  if (!isPremiumUser()) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 hover:scale-110 transform transition-all duration-300 flex items-center justify-center group z-50 animate-pulse"
          aria-label="Open premium prompt"
        >
          <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </button>

        {isOpen && (
          <div className="fixed bottom-6 right-6 w-11/12 max-w-md sm:max-w-lg md:max-w-xl lg:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Premium Feature</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-red-100 flex items-center justify-center transition-all duration-200 group"
                title="Close"
                aria-label="Close premium prompt"
              >
                <X className="w-4 h-4 text-gray-600 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                {isLoggedIn
                  ? 'The AI Chatbot is exclusive to premium users. Upgrade to unlock this feature and more!'
                  : 'Please log in and upgrade to a premium plan to access the AI Chatbot.'}
              </p>
              <Link
                href={isLoggedIn ? '/premium' : '/login'}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-orange-600 transition-all duration-200"
              >
                <Crown className="w-5 h-5 mr-2" />
                {isLoggedIn ? 'Buy Premium' : 'Log In to Buy Premium'}
              </Link>
            </div>
          </div>
        )}
      </>
    );
  }

  // Full chatbot interface for premium users
  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 hover:scale-110 transform transition-all duration-300 flex items-center justify-center group z-50 animate-pulse"
          aria-label="Open chat"
        >
          <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 w-11/12 max-w-md sm:max-w-lg md:max-w-xl lg:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[600px]'
          } overflow-hidden flex flex-col`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Assistant</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-white/90 text-sm">Online & Ready</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearChat}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors duration-200 group"
                title="Clear Chat"
                aria-label="Clear chat"
              >
                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                title={isMinimized ? 'Maximize' : 'Minimize'}
                aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-red-500 flex items-center justify-center transition-all duration-200 group"
                title="Close Chat"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isUser
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border-2 border-white shadow-sm'
                      }`}
                    >
                      {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`max-w-[calc(100%-60px)] ${message.isUser ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`inline-block p-3 rounded-2xl shadow-sm ${
                          message.isUser
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-md'
                        }`}
                      >
                        <div
                          className="text-sm leading-relaxed whitespace-pre-wrap message-content"
                          dangerouslySetInnerHTML={formatMessageContent(message.content)}
                        />
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border-2 border-white shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-3 shadow-md">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200/50 flex-shrink-0">
                <div className="flex items-end space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message here..."
                      disabled={isLoading}
                      className="w-full p-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none bg-white/90 backdrop-blur-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-gray-900"
                      rows={1}
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl group flex-shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by Bitecodes • Press Enter to send
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Add CSS for formatted content */}
      <style jsx>{`
        .message-content :global(strong) {
          font-weight: 600;
        }

        .message-content :global(code) {
          background-color: #f3f4f6;
          padding: 0.1rem 0.3rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875em;
        }

        .message-content :global(pre) {
          background-color: #f3f4f6;
          padding: 0.75rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 0.5rem 0;
        }

        .message-content :global(pre code) {
          background: none;
          padding: 0;
          border-radius: 0;
        }
      `}</style>
    </>
  );
};

export default ChatbotClient;