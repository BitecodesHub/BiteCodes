"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  ArrowLeft,
  Send,
  Tag,
  Globe,
  Users,
  Lock,
  BookOpen,
  School,
  Image,
  X,
  Loader2,
} from "lucide-react";

const POST_TYPES = [
  { value: "QUESTION", label: "Question", icon: BookOpen },
  { value: "DISCUSSION", label: "Discussion", icon: Users },
  { value: "ANNOUNCEMENT", label: "Announcement", icon: Send },
  { value: "DOUBT", label: "Doubt", icon: BookOpen },
  { value: "EXPERIENCE", label: "Experience", icon: School },
  { value: "RESOURCE", label: "Resource", icon: BookOpen },
];

const VISIBILITY_OPTIONS = [
  { value: "PUBLIC", label: "Public", icon: Globe, description: "Anyone can see" },
  { value: "FOLLOWERS", label: "Followers", icon: Users, description: "Only your followers" },
  { value: "PRIVATE", label: "Private", icon: Lock, description: "Only you" },
];

export default function CreatePostPage() {
  const router = useRouter();
  const { user: authUser, isLoggedIn, getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    postType: "QUESTION",
    entranceExamId: "",
    universitySlug: "",
    tags: [] as string[],
    visibility: "PUBLIC",
    mediaUrls: [] as string[],
  });

  const [currentTag, setCurrentTag] = useState("");
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);

  if (!isLoggedIn || !authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to create a post</p>
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const token = getToken();
    if (!token) {
      setError("Authentication token is missing. Please sign in again.");
      router.push("/login");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxPhotos = 10;

    const validFiles = [];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a valid image type`);
        continue;
      }
      if (file.size > maxSize) {
        alert(`${file.name} is too large (max 5MB)`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    if (formData.mediaUrls.length + validFiles.length > maxPhotos) {
      alert(`You can only upload up to ${maxPhotos} photos per post`);
      return;
    }

    try {
      setUploadingPhotos(true);
      const uploadedUrls: string[] = [];

      for (const file of validFiles) {
        const formDataUpload = new FormData();
        formDataUpload.append("thumbnailUrl", file);

        const response = await axios.post(`${API_BASE_URL}/upload/profilephoto`, formDataUpload, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        });

        if (response.data && typeof response.data === "string") {
          uploadedUrls.push(response.data);
        }
      }

      setFormData((prev) => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, ...uploadedUrls],
      }));
      setPhotoPreviewUrls((prev) => [...prev, ...uploadedUrls]);

      alert(`${uploadedUrls.length} photo(s) uploaded successfully!`);
    } catch (err: any) {
      console.error("Error uploading photos:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please sign in again.");
        router.push("/login");
      } else {
        setError(err.response?.data?.message || "Failed to upload some photos. Please try again.");
      }
    } finally {
      setUploadingPhotos(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, idx) => idx !== indexToRemove),
    }));
    setPhotoPreviewUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required");
      return;
    }

    if (!authUser || !authUser.userid) {
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
      setIsSubmitting(true);
      setError(null);

      // Convert mediaUrls to media array format expected by backend
      const mediaArray = formData.mediaUrls.map((url, index) => ({
        mediaType: "IMAGE",
        url: url,
        thumbnailUrl: url,
        displayOrder: index,
        caption: null,
      }));

      const payload = {
        title: formData.title,
        content: formData.content,
        postType: formData.postType,
        userId: authUser.userid,
        entranceExamId: formData.entranceExamId.trim() || null,
        universitySlug: formData.universitySlug.trim() || null,
        tags: formData.tags.length > 0 ? formData.tags : [],
        visibility: formData.visibility,
        media: mediaArray.length > 0 ? mediaArray : [],
      };

      console.log("Submitting payload:", payload); // Debug log

      const response = await axios.post(`${API_BASE_URL}/api/posts`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });

      if (response.status === 201) {
        alert("Post created successfully!");
        router.push(`/posts/${response.data.id}`);
      }
    } catch (err: any) {
      console.error("Error creating post:", err);
      console.error("Error response:", err.response?.data);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please sign in again.");
        router.push("/login");
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to create post. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Post</h1>
              <p className="text-gray-600">Share your thoughts with the community</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Post Type</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {POST_TYPES.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, postType: type.value }))}
                      className={`flex items-center space-x-2 p-3 rounded-lg border-2 text-left transition-all ${
                        formData.postType === type.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 px-4 py-3 text-black transition-colors"
                placeholder="Enter a clear and descriptive title..."
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 px-4 py-3 text-black transition-colors resize-none"
                placeholder="Share your thoughts, questions, or experiences..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Photos (Optional - Max 10)
              </label>

              {photoPreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                  {photoPreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                          Thumbnail
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {formData.mediaUrls.length < 10 && (
                <label
                  htmlFor="photo-upload"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                    uploadingPhotos
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                  }`}
                >
                  {uploadingPhotos ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
                      <p className="text-sm text-blue-600 font-medium">Uploading photos...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Image className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 font-medium mb-1">
                        Click to upload photos
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF, WebP up to 5MB each
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {formData.mediaUrls.length}/10 photos uploaded
                      </p>
                    </div>
                  )}
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploadingPhotos}
                  />
                </label>
              )}

              {formData.mediaUrls.length >= 10 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm">
                    Maximum 10 photos reached. Remove some to add more.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2 text-black transition-colors"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Add
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="entranceExamId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Related Exam (Optional)
                </label>
                <input
                  type="text"
                  id="entranceExamId"
                  value={formData.entranceExamId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, entranceExamId: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 px-4 py-3 text-black transition-colors"
                  placeholder="e.g., jee-main, neet"
                />
              </div>

              <div>
                <label
                  htmlFor="universitySlug"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Related University (Optional)
                </label>
                <input
                  type="text"
                  id="universitySlug"
                  value={formData.universitySlug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, universitySlug: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 px-4 py-3 text-black transition-colors"
                  placeholder="e.g., iit-bombay, du"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Visibility</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {VISIBILITY_OPTIONS.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, visibility: option.value }))}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 text-left transition-all ${
                        formData.visibility === option.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <IconComponent className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || uploadingPhotos}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5 mr-2" />
                {isSubmitting ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}