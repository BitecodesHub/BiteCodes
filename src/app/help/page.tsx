"use client";
import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, Mail, User, BookOpen, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);

    // Web3Forms required access key
    formData.append("access_key", "610ab766-0a22-4922-9b13-d3d028b77ad6");

    // Enhanced fields for maximum context
    formData.append("subject", "Support Request from Bitecodes Academy User");
    formData.append("from_name", formData.get("name") as string);
    formData.append("from_email", formData.get("email") as string);
    formData.append("reply_to", formData.get("email") as string);
    formData.append("tags", "bitecodes,support,ai-mock-test,subscription");
    formData.append("redirect", "https://bitcodes.com/thank-you");
    formData.append("page_url", window.location.href);
    formData.append("user_agent", navigator.userAgent);
    formData.append("plan_type", formData.get("plan") ? (formData.get("plan") as string) : "free");
    // Additional fields
    formData.append("user_id", formData.get("userId") ? (formData.get("userId") as string) : "anonymous");
    formData.append("course_interest", formData.get("course") ? (formData.get("course") as string) : "none");
    formData.append("preferred_contact_method", formData.get("contactMethod") as string);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setStatus("success");
        setMessage("Your message has been sent successfully!");
        toast.success("Message sent! We'll get back to you soon.", {
          icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
        });
        e.currentTarget.reset();
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 5000);
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
      toast.error(err.message || "Failed to send message", {
        icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200/50">
        <div className="flex items-center justify-center mb-6">
          <Mail className="w-8 h-8 text-blue-600 mr-2" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Us</h2>
        </div>
        <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
          Reach out for support or inquiries about our AI-powered mock tests
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all text-sm sm:text-base"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all text-sm sm:text-base"
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              name="userId"
              placeholder="User ID (Optional)"
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all text-sm sm:text-base"
            />
          </div>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              name="plan"
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all appearance-none text-sm sm:text-base"
            >
              <option value="">Select Your Plan (Optional)</option>
              <option value="Free">Free</option>
              <option value="Premium">Premium</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              name="course"
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all appearance-none text-sm sm:text-base"
            >
              <option value="">Select Course Interest (Optional)</option>
              <option value="JEE">JEE Preparation</option>
              <option value="NEET">NEET Preparation</option>
              <option value="UPSC">UPSC Preparation</option>
              <option value="GATE">GATE Preparation</option>
              <option value="CAT">CAT Preparation</option>
            </select>
          </div>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              name="contactMethod"
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all appearance-none text-sm sm:text-base"
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all resize-none text-sm sm:text-base"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all transform hover:scale-105 text-sm sm:text-base"
          >
            {status === "sending" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                <span>Send Message</span>
              </>
            )}
          </button>
          {status === "success" && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 flex items-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-sm sm:text-base text-green-700 font-medium">{message}</p>
            </div>
          )}
          {status === "error" && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-sm sm:text-base text-red-700 font-medium">{message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}