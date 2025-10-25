"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter for redirects
import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  Filter,
  Search,
  Plus,
  TrendingUp,
  Clock,
  Users,
  Zap,
  X,
  UserPlus,
  UserCheck,
  Send,
  Eye,
  Flag,
  MoreVertical,
  Edit,
  Trash2,
  Pin,
  Award,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  ChevronDown,
  AlertCircle,
  Sparkles,
  FileText,
} from "lucide-react";

// Types
interface Post {
  id: number;
  author: {
    id: number;
    username: string;
    name: string;
    profileurl: string;
    bio: string;
    isFollowing: boolean;
  };
  title: string;
  content: string;
  contentPreview: string;
  postType: "QUESTION" | "DISCUSSION" | "ANNOUNCEMENT" | "DOUBT" | "EXPERIENCE" | "RESOURCE";
  entranceExam: { id: string; name: string; fullName: string } | null;
  university: any | null;
  tags: string[];
  thumbnailUrl: string | null;
  media: Array<{
    id: number;
    mediaType: "IMAGE" | "VIDEO" | "FILE";
    url: string;
    thumbnailUrl: string;
    caption: string;
  }>;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isTrending: boolean;
  isPinned: boolean;
  createdAt: string;
  isLiked: boolean;
  isBookmarked: boolean;
  userReaction: "LIKE" | "LOVE" | "HELPFUL" | "INSIGHTFUL" | "CELEBRATE" | "FIRE" | null;
}

const POST_TYPE_FILTERS = [
  { value: "ALL", label: "All Posts", icon: Sparkles },
  { value: "QUESTION", label: "Questions", icon: MessageCircle },
  { value: "DISCUSSION", label: "Discussions", icon: Users },
  { value: "ANNOUNCEMENT", label: "Announcements", icon: AlertCircle },
  { value: "DOUBT", label: "Doubts", icon: MessageCircle },
  { value: "EXPERIENCE", label: "Experiences", icon: Award },
  { value: "RESOURCE", label: "Resources", icon: FileText },
];

const REACTIONS = [
  { type: "LIKE", emoji: "👍", label: "Like" },
  { type: "LOVE", emoji: "❤️", label: "Love" },
  { type: "HELPFUL", emoji: "💡", label: "Helpful" },
  { type: "INSIGHTFUL", emoji: "🤔", label: "Insightful" },
  { type: "CELEBRATE", emoji: "🎉", label: "Celebrate" },
  { type: "FIRE", emoji: "🔥", label: "Fire" },
];

export default function EnhancedFeedPage() {
  // State Management
  const { user: authUser, isLoggedIn, getToken } = useAuth();
  const router = useRouter(); // Added for redirecting on auth errors
  const [posts, setPosts] = useState<Post[]>([]);
  const [feedType, setFeedType] = useState<"TRENDING" | "RECENT" | "FOLLOWING">("TRENDING");
  const [postTypeFilter, setPostTypeFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sharePostId, setSharePostId] = useState<number | null>(null);
  const [reactionMenuId, setReactionMenuId] = useState<number | null>(null);
  const [optionsMenuId, setOptionsMenuId] = useState<number | null>(null);
  const [mediaViewerId, setMediaViewerId] = useState<number | null>(null);
  const [reportPostId, setReportPostId] = useState<number | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // Fetch Feed
  useEffect(() => {
    if (isLoggedIn) {
      fetchFeed(0, true);
    }
  }, [feedType, postTypeFilter, isLoggedIn]);

  // Infinite Scroll
  useEffect(() => {
    if (isLoading || !hasMore) return;

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchFeed(page + 1, false);
      }
    });

    if (lastPostRef.current) {
      observerRef.current.observe(lastPostRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, hasMore, page]);

  const fetchFeed = async (pageNum: number, replace = false) => {
    const token = getToken();
    if (!token) {
      setError("Authentication token is missing. Please sign in again.");
      router.push("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const params: any = {
        feedType,
        page: pageNum,
        size: 10,
      };

      if (postTypeFilter !== "ALL") {
        params.postType = postTypeFilter;
      }

      const response = await axios.get(`${API_BASE_URL}/api/posts/feed`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });

      if (response.status === 200) {
        const newPosts = response.data.posts || [];
        setPosts((prev) => (replace ? newPosts : [...prev, ...newPosts]));
        setHasMore(response.data.hasNext);
        setPage(pageNum);
      }
    } catch (err: any) {
      console.error("Error fetching feed:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please sign in again.");
        router.push("/login");
      } else {
        setError(err.response?.data?.message || "Failed to load feed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReact = async (postId: number, reactionType: string) => {
    if (!authUser?.userid) {
      setError("User authentication required");
      router.push("/login");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication token is missing. Please sign in again.");
      router.push("/login");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/posts/${postId}/react/${authUser.userid}`,
        { reactionType },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            const isSameReaction = post.userReaction === reactionType;
            return {
              ...post,
              userReaction: isSameReaction ? null : (reactionType as any),
              likeCount: isSameReaction
                ? post.likeCount - 1
                : post.userReaction
                ? post.likeCount
                : post.likeCount + 1,
            };
          }
          return post;
        })
      );
      setReactionMenuId(null);
    } catch (err: any) {
      console.error("Error reacting to post:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please sign in again.");
        router.push("/login");
      } else {
        setError(err.response?.data?.message || "Failed to react to post.");
      }
    }
  };

  const handleBookmark = async (postId: number) => {
    if (!authUser?.userid) {
      setError("User authentication required");
      router.push("/login");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication token is missing. Please sign in again.");
      router.push("/login");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/posts/${postId}/bookmark/${authUser.userid}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
        )
      );
    } catch (err: any) {
      console.error("Error bookmarking post:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please sign in again.");
        router.push("/login");
      } else {
        setError(err.response?.data?.message || "Failed to bookmark post.");
      }
    }
  };

  const handleFollow = async (authorId: number) => {
    if (!authUser?.userid) {
      setError("User authentication required");
      router.push("/login");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication token is missing. Please sign in again.");
      router.push("/login");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/users/${authUser.userid}/follow/${authorId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );
      setPosts((prev) =>
        prev.map((post) =>
          post.author.id === authorId
            ? { ...post, author: { ...post.author, isFollowing: !post.author.isFollowing } }
            : post
        )
      );
    } catch (err: any) {
      console.error("Error following user:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please sign in again.");
        router.push("/login");
      } else {
        setError(err.response?.data?.message || "Failed to follow user.");
      }
    }
  };

  const handleDelete = async (postId: number) => {
    if (!authUser?.userid) {
      setError("User authentication required");
      router.push("/login");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication token is missing. Please sign in again.");
      router.push("/login");
      return;
    }

    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      setOptionsMenuId(null);
      alert("Post deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting post:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please sign in again.");
        router.push("/login");
      } else {
        setError(err.response?.data?.message || "Failed to delete post.");
        alert("Failed to delete post");
      }
    }
  };

  const copyToClipboard = (postId: number) => {
    const url = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
    setSharePostId(null);
  };

  const shareToSocial = (platform: string, postId: number) => {
    const url = `${window.location.origin}/posts/${postId}`;
    const post = posts.find((p) => p.id === postId);
    const text = post?.title || "Check out this post";

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    };

    window.open(urls[platform], "_blank", "width=600,height=400");
    setSharePostId(null);
  };

  const filteredPosts = posts.filter((post) => {
    if (searchQuery) {
      return (
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return true;
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatCount = (count: number) => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join the Community</h2>
          <p className="text-gray-600 mb-8">Connect with thousands of students and educators preparing for entrance exams</p>
          <Link
            href="/login"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Sign In to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b sticky top-0 z-30 backdrop-blur-lg bg-opacity-95">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Community Feed
              </h1>
              <p className="text-gray-600 mt-1">Discover, learn, and connect with peers</p>
            </div>
            <Link
              href="/create-post"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Post
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-gray-900 transition-all"
              placeholder="Search posts, tags, or topics..."
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Feed Type Tabs */}
          <div className="flex items-center space-x-2 border-b-2 border-gray-200 overflow-x-auto pb-px">
            <button
              onClick={() => setFeedType("TRENDING")}
              className={`flex items-center px-5 py-3 text-sm font-semibold border-b-4 transition-all whitespace-nowrap ${
                feedType === "TRENDING"
                  ? "border-blue-600 text-blue-600 bg-blue-50 rounded-t-lg"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-lg"
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </button>
            <button
              onClick={() => setFeedType("RECENT")}
              className={`flex items-center px-5 py-3 text-sm font-semibold border-b-4 transition-all whitespace-nowrap ${
                feedType === "RECENT"
                  ? "border-purple-600 text-purple-600 bg-purple-50 rounded-t-lg"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-lg"
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Recent
            </button>
            <button
              onClick={() => setFeedType("FOLLOWING")}
              className={`flex items-center px-5 py-3 text-sm font-semibold border-b-4 transition-all whitespace-nowrap ${
                feedType === "FOLLOWING"
                  ? "border-green-600 text-green-600 bg-green-50 rounded-t-lg"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-lg"
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Following
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ml-auto flex items-center px-5 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Filters Dropdown */}
          {showFilters && (
            <div className="mt-4 p-5 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-blue-600" />
                Filter by Post Type
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {POST_TYPE_FILTERS.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.value}
                      onClick={() => setPostTypeFilter(filter.value)}
                      className={`flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                        postTypeFilter === filter.value
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                          : "bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && posts.length === 0 ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 animate-pulse"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32 mb-2"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-40"></div>
                  </div>
                </div>
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 mb-3"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full mb-2"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-5/6"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-10 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 font-semibold mb-6 text-lg">{error}</p>
            <button
              onClick={() => fetchFeed(0, true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Zap className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No posts found</h3>
            <p className="text-gray-600 mb-8 text-lg">
              {searchQuery ? "Try different search terms or explore other topics" : "Be the first to share your thoughts with the community!"}
            </p>
            <Link
              href="/create-post"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post, index) => (
              <div
                key={post.id}
                ref={index === filteredPosts.length - 1 ? lastPostRef : null}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1">
                      <Link href={`/users/${post.author.id}`}>
                        <img
                          src={post.author.profileurl || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                          alt={post.author.name}
                          className="w-12 h-12 rounded-full object-cover cursor-pointer ring-2 ring-gray-200 hover:ring-blue-500 transition-all"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <Link href={`/users/${post.author.id}`}>
                            <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors">{post.author.name}</h3>
                          </Link>
                          {post.isPinned && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                              <Pin className="w-3 h-3 mr-1" />
                              Pinned
                            </span>
                          )}
                          {post.isTrending && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-100 to-red-100 text-orange-800">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800">
                            {post.postType}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-sm text-gray-500">@{post.author.username}</p>
                          <span className="text-gray-400">·</span>
                          <p className="text-sm text-gray-500">{formatTime(post.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {authUser?.userid !== post.author.id && (
                          <button
                            onClick={() => handleFollow(post.author.id)}
                            className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                              post.author.isFollowing
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg"
                            }`}
                          >
                            {post.author.isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                            <span className="hidden sm:inline">{post.author.isFollowing ? "Following" : "Follow"}</span>
                          </button>
                        )}
                        <div className="relative">
                          <button
                            onClick={() => setOptionsMenuId(optionsMenuId === post.id ? null : post.id)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-all"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {optionsMenuId === post.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border-2 border-gray-100 py-2 z-20">
                              {authUser?.userid === post.author.id ? (
                                <>
                                  <Link
                                    href={`/posts/edit?id=${post.id}`}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                  >
                                    <Edit className="w-4 h-4 mr-3" />
                                    Edit Post
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(post.id)}
                                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 mr-3" />
                                    Delete Post
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setReportPostId(post.id);
                                      setOptionsMenuId(null);
                                    }}
                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    <Flag className="w-4 h-4 mr-3" />
                                    Report Post
                                  </button>
                                  <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Eye className="w-4 h-4 mr-3" />
                                    Hide Post
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {post.entranceExam && (
                    <Link href={`/entrance-exams/${post.entranceExam.id}`}>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 hover:from-blue-200 hover:to-cyan-200 cursor-pointer transition-all mb-3">
                        {post.entranceExam.name}
                      </span>
                    </Link>
                  )}

                  {/* Post Content */}
                  <Link href={`/posts/${post.id}`}>
                    <div className="cursor-pointer group">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-gray-700 leading-relaxed line-clamp-3 mb-3">
                        {post.contentPreview || post.content}
                      </p>
                    </div>
                  </Link>

                  {/* Post Media */}
                  {post.thumbnailUrl && (
                    <div className="mt-4 rounded-xl overflow-hidden cursor-pointer" onClick={() => setMediaViewerId(post.id)}>
                      <img
                        src={post.thumbnailUrl}
                        alt="Post media"
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map((tag, idx) => (
                        <Link key={idx} href={`/search?q=${encodeURIComponent(tag)}`}>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-blue-100 hover:to-purple-100 hover:text-blue-800 cursor-pointer transition-all">
                            #{tag}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Stats */}
                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {formatCount(post.viewCount)} views
                      </span>
                      {post.userReaction && (
                        <span className="flex items-center font-medium text-blue-600">
                          {REACTIONS.find((r) => r.type === post.userReaction)?.emoji} You reacted
                        </span>
                      )}
                    </div>
                    {post.shareCount > 0 && <span>{formatCount(post.shareCount)} shares</span>}
                  </div>
                </div>

                {/* Post Actions */}
                <div className="px-6 py-4 border-t-2 border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {/* Reaction Button */}
                      <div className="relative">
                        <button
                          onClick={() => setReactionMenuId(reactionMenuId === post.id ? null : post.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                            post.userReaction
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                              : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${post.userReaction ? "fill-current" : ""}`} />
                          <span>{formatCount(post.likeCount)}</span>
                        </button>

                        {/* Reaction Menu */}
                        {reactionMenuId === post.id && (
                          <div className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 p-3 flex space-x-2 z-20">
                            {REACTIONS.map((reaction) => (
                              <button
                                key={reaction.type}
                                onClick={() => handleReact(post.id, reaction.type)}
                                className={`flex flex-col items-center p-2 rounded-xl transition-all hover:bg-gray-100 hover:scale-125 ${
                                  post.userReaction === reaction.type ? "bg-blue-50 ring-2 ring-blue-500" : ""
                                }`}
                                title={reaction.label}
                              >
                                <span className="text-2xl mb-1">{reaction.emoji}</span>
                                <span className="text-xs font-medium text-gray-600">{reaction.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <Link
                        href={`/posts/${post.id}#comments`}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200 transition-all"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>{formatCount(post.commentCount)}</span>
                      </Link>

                      <button
                        onClick={() => setSharePostId(post.id)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200 transition-all"
                      >
                        <Share2 className="w-5 h-5" />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleBookmark(post.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        post.isBookmarked
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                          : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${post.isBookmarked ? "fill-current" : ""}`} />
                      <span className="hidden sm:inline">{post.isBookmarked ? "Saved" : "Save"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && posts.length > 0 && (
              <div className="text-center py-8">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 mt-4 font-medium">Loading more posts...</p>
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600 font-medium">You're all caught up! 🎉</p>
                <p className="text-gray-500 text-sm mt-2">Check back later for more updates</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {sharePostId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setSharePostId(null)}
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Share Post</h3>
              <button
                onClick={() => setSharePostId(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => copyToClipboard(sharePostId)}
                className="w-full flex items-center space-x-4 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Copy className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">Copy Link</p>
                  <p className="text-sm text-gray-500">Share via any platform</p>
                </div>
              </button>

              <button
                onClick={() => shareToSocial("twitter", sharePostId)}
                className="w-full flex items-center space-x-4 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">Share on X</p>
                  <p className="text-sm text-gray-500">Post to your followers</p>
                </div>
              </button>

              <button
                onClick={() => shareToSocial("facebook", sharePostId)}
                className="w-full flex items-center space-x-4 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">Share on Facebook</p>
                  <p className="text-sm text-gray-500">Share with friends</p>
                </div>
              </button>

              <button
                onClick={() => shareToSocial("linkedin", sharePostId)}
                className="w-full flex items-center space-x-4 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-700 hover:bg-blue-50 transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Linkedin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">Share on LinkedIn</p>
                  <p className="text-sm text-gray-500">Professional network</p>
                </div>
              </button>

              <button
                onClick={() => shareToSocial("whatsapp", sharePostId)}
                className="w-full flex items-center space-x-4 p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">Share on WhatsApp</p>
                  <p className="text-sm text-gray-500">Message directly</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Viewer Modal */}
      {mediaViewerId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setMediaViewerId(null)}
        >
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMediaViewerId(null)}
              className="absolute -top-12 right-0 p-2 rounded-xl text-white hover:bg-white hover:bg-opacity-20 transition-all"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={posts.find((p) => p.id === mediaViewerId)?.thumbnailUrl || ""}
              alt="Full size"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-95 rounded-xl p-4 backdrop-blur-sm">
              <p className="font-semibold text-gray-900">{posts.find((p) => p.id === mediaViewerId)?.title}</p>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportPostId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setReportPostId(null)}
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Report Post</h3>
              <button
                onClick={() => setReportPostId(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">Why are you reporting this post?</p>

            <div className="space-y-3">
              {["Spam", "Harassment", "Misinformation", "Inappropriate Content", "Copyright Violation", "Other"].map(
                (reason) => (
                  <button
                    key={reason}
                    onClick={() => {
                      alert(`Post reported for: ${reason}. Thank you for helping keep our community safe.`);
                      setReportPostId(null);
                    }}
                    className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all text-left font-medium text-gray-900"
                  >
                    {reason}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}