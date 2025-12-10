"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { ArrowLeft, Send, Paperclip, MoreHorizontal, User } from "lucide-react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface Message {
  id: number;
  conversationId: number;
  sender: {
    id: number;
    username: string;
    name: string;
    profileurl: string;
    bio: string;
  };
  content: string;
  messageType: string;
  mediaUrl: string | null;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
  isSentByMe: boolean;
}

interface Conversation {
  id: number;
  otherUser: {
    id: number;
    username: string;
    name: string;
    profileurl: string;
    bio: string;
  };
}

export default function ChatConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoggedIn, getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const conversationId = params.conversationId as string;

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    fetchConversationData();
    setupWebSocket();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId, isLoggedIn]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversationData = async () => {
    const token = getToken();
    if (!token) {
      setError("Authentication token is missing. Please sign in again.");
      router.push("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const conversationsResponse = await axios.get(`${API_BASE_URL}/api/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 0, size: 100 }
      });

      const currentConversation = conversationsResponse.data.content.find(
        (conv: any) => conv.id.toString() === conversationId
      );

      if (!currentConversation) {
        setError("Conversation not found");
        return;
      }

      setConversation(currentConversation);

      const messagesResponse = await axios.get(
        `${API_BASE_URL}/api/chat/conversations/${conversationId}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 0, size: 100 }
        }
      );

      setMessages(messagesResponse.data.content || []);

      // Mark messages as read
      await axios.post(
        `${API_BASE_URL}/api/chat/conversations/${conversationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err: any) {
      console.error("Error fetching conversation:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please sign in again.");
        router.push("/login");
      } else {
        setError(err.response?.data?.message || "Failed to load conversation. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setupWebSocket = () => {
    const token = getToken();
    if (!token) return;

    const socket = new SockJS(`${API_BASE_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket Connected');
        setIsConnected(true);

        // Subscribe to personal message queue
        client.subscribe('/user/queue/messages', (message) => {
          console.log('Received message:', message.body);
          const newMsg: Message = JSON.parse(message.body);
          if (newMsg.conversationId.toString() === conversationId) {
            setMessages((prev) => [...prev, newMsg]);
            // Mark as read immediately
            axios.post(
              `${API_BASE_URL}/api/chat/conversations/${conversationId}/read`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
        });

        // Subscribe to typing indicators
        client.subscribe(`/topic/typing/${conversationId}`, (message) => {
          console.log('Typing indicator:', message.body);
          const typing = JSON.parse(message.body);
          setIsTyping(typing.isTyping);
        });
      },
      onStompError: (frame) => {
        console.error('WebSocket STOMP error:', frame);
        setIsConnected(false);
        setError("Failed to connect to chat service. Retrying...");
      },
      onWebSocketClose: () => {
        console.log('WebSocket closed');
        setIsConnected(false);
      }
    });

    client.activate();
    stompClientRef.current = client;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation || !isConnected) return;

    const token = getToken();
    if (!token) {
      setError("Authentication token is missing. Please sign in again.");
      router.push("/login");
      return;
    }

    try {
      setIsSending(true);
      
      const messagePayload = {
        receiverId: conversation.otherUser.id,
        content: newMessage.trim(),
        messageType: "TEXT",
        mediaUrl: null
      };

      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.publish({
          destination: "/app/chat.send",
          body: JSON.stringify(messagePayload),
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNewMessage("");
        
        // Stop typing indicator
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        sendTypingIndicator(false);
      } else {
        throw new Error("WebSocket not connected");
      }
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
      
      // Fallback to REST API if WebSocket fails
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/chat/messages`,
          {
            receiverId: conversation.otherUser.id,
            content: newMessage.trim(),
            messageType: "TEXT"
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages((prev) => [...prev, response.data]);
        setNewMessage("");
      } catch (restErr) {
        console.error("REST fallback failed:", restErr);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = () => {
    if (!conversation || !isConnected) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing indicator
    if (newMessage.length > 0) {
      sendTypingIndicator(true);
      
      // Stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(false);
      }, 3000);
    } else {
      sendTypingIndicator(false);
    }
  };

  const sendTypingIndicator = (isTyping: boolean) => {
    const token = getToken();
    if (!token || !stompClientRef.current || !stompClientRef.current.connected) return;

    try {
      stompClientRef.current.publish({
        destination: "/app/chat.typing",
        body: JSON.stringify({
          conversationId: parseInt(conversationId),
          isTyping: isTyping
        }),
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Error sending typing indicator:", err);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isNewDay = (currentMsg: Message, previousMsg: Message | null) => {
    if (!previousMsg) return true;
    const currentDate = new Date(currentMsg.createdAt).toDateString();
    const previousDate = new Date(previousMsg.createdAt).toDateString();
    return currentDate !== previousDate;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view messages</p>
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error && !conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Conversation Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/chat")}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/chat")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {conversation && (
              <>
                <img
                  src={conversation.otherUser.profileurl || "https://webcrumbs.cloud/placeholder"}
                  alt={conversation.otherUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h1 className="font-semibold text-gray-900">{conversation.otherUser.name}</h1>
                  <p className="text-sm text-gray-500">
                    @{conversation.otherUser.username}
                    {isTyping && " • typing..."}
                    {!isConnected && " • connecting..."}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600">
                Start a conversation with {conversation?.otherUser.name}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                const previousMessage = index > 0 ? messages[index - 1] : null;
                const showDate = isNewDay(message, previousMessage);

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="flex justify-center my-6">
                        <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${message.isSentByMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.isSentByMe
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white border border-gray-200 text-gray-900 rounded-bl-none shadow-sm"
                        }`}
                      >
                        <p className="text-sm break-words">{message.content}</p>
                        <div
                          className={`text-xs mt-1 ${
                            message.isSentByMe ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.createdAt)}
                          {message.isSentByMe && message.isRead && " • Read"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              disabled
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              className="flex-1 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-2 text-sm text-gray-900 placeholder-gray-500"
              placeholder={isConnected ? "Type a message..." : "Connecting..."}
              disabled={isSending || !isConnected}
            />
            <button
              type="submit"
              disabled={isSending || !newMessage.trim() || !isConnected}
              className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}