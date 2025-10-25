"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";
import { MessageCircle, Search, User, Clock, Check, CheckCheck, X } from "lucide-react";

interface Conversation {
  id: number;
  otherUser: {
    id: number;
    username: string;
    name: string;
    profileurl: string;
    bio: string;
    isOnline?: boolean;
  };
  lastMessage: {
    id: number;
    content: string;
    messageType: string;
    isRead: boolean;
    createdAt: string;
    isSentByMe: boolean;
  };
  unreadCount: number;
  lastMessageAt: string;
  createdAt: string;
}

export default function ChatPage() {
  const { user, isLoggedIn, getToken } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    if (isLoggedIn) {
      fetchConversations();
    }
  }, [isLoggedIn]);

  const fetchConversations = async () => {
    const token = getToken();
    if (!token) {
      setError("Authentication token is missing. Please sign in again.");
      router.push("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/chat/conversations`, {
        params: { page: 0, size: 20 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(response.data.content || []);
    } catch (err: any) {
      console.error("Error fetching conversations:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please sign in again.");
        router.push("/login");
      } else {
        setError(err.response?.data?.message || "Failed to load conversations. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (conversationId: number) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    const token = getToken();
    if (!token) {
      setError("Authentication token is missing. Please sign in again.");
      router.push("/login");
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/chat/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
      alert("Conversation deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting conversation:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please sign in again.");
        router.push("/login");
      } else {
        setError(err.response?.data?.message || "Failed to delete conversation.");
        alert("Failed to delete conversation.");
      }
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m ago`;
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your messages</p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-600">Chat with other students and educators</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black"
              placeholder="Search conversations..."
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchConversations()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600 mb-6">No conversations available.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <Link href={`/chat/${conversation.id}`} className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="relative">
                    <img
                      src={conversation.otherUser.profileurl || "https://webcrumbs.cloud/placeholder"}
                      alt={conversation.otherUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.otherUser.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{conversation.otherUser.name}</h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {conversation.lastMessage.isSentByMe && (
                        conversation.lastMessage.isRead ? (
                          <CheckCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        ) : (
                          <Check className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )
                      )}
                      <p
                        className={`text-sm truncate ${
                          conversation.unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-600"
                        }`}
                      >
                        {conversation.lastMessage.isSentByMe && "You: "}
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => handleDeleteConversation(conversation.id)}
                  className="ml-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}