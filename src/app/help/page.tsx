"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  User,
  BookOpen,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  Send,
  Star,
  Shield,
  Award,
  Users,
  Brain,
  Target,
  ChevronRight,
  Zap,
  MessageCircle,
  Code,
  Sparkles,
  X,
} from "lucide-react";

type Status = "idle" | "sending" | "success" | "error";

type FormDataType = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  inquiryType: string;
  contactMethod: string;
  urgency: string;
  message: string;
};

export default function EnhancedContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("contact");
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
    organization: "",
    inquiryType: "",
    contactMethod: "email",
    urgency: "normal",
    message: "",
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const formRef = useRef<HTMLFormElement | null>(null);
  const successBannerRef = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef<boolean>(true);
  const currentController = useRef<AbortController | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep a ref for status so scheduled callbacks don't suffer stale-narrowing
  const statusRef = useRef<Status>(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const FETCH_TIMEOUT = 10000; // ms

  useEffect(() => {
    return () => {
      isMounted.current = false;
      currentController.current?.abort();
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      if (pendingResetTimeoutRef.current) clearTimeout(pendingResetTimeoutRef.current);
    };
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const parseErrorMessage = useCallback(async (resp: Response) => {
    try {
      const ct = resp.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const json = await resp.json();
        return json?.message || json?.error || JSON.stringify(json);
      }
      const text = await resp.text();
      return text || `Request failed with status ${resp.status}`;
    } catch {
      return `Request failed with status ${resp.status}`;
    }
  }, []);

  const doPostWithTimeout = useCallback(
    async (url: string, body: string, controller: AbortController) => {
      const timeoutId = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT);
      try {
        const resp = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body,
          signal: controller.signal,
        });
        return resp;
      } finally {
        window.clearTimeout(timeoutId);
      }
    },
    []
  );

  const resetFormToIdle = useCallback(() => {
    if (!isMounted.current) return;
    setStatus("idle");
    setMessage("");
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Check the ref to avoid stale type-narrowing / wrong inference by TS
      if (statusRef.current === "sending") return;

      setStatus("sending");
      setMessage("");

      const payload = {
        ...formData,
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      } as const;

      const controller = new AbortController();
      currentController.current = controller;

      try {
        const response = await doPostWithTimeout(
          `${API_BASE_URL}/api/contact`,
          JSON.stringify(payload),
          controller
        );

        if (response.status >= 200 && response.status < 300) {
          let backendMsg = "";
          try {
            const ct = response.headers.get("content-type") || "";
            if (ct.includes("application/json")) {
              const json = await response.json();
              backendMsg = json?.message || json?.msg || "";
            } else {
              backendMsg = (await response.text()) || "";
            }
          } catch (parseError) {
            console.error("Parse error:", parseError);
            backendMsg = "";
          }

          const successText =
            backendMsg || "Thank you! We've received your message and will contact you shortly.";

          // Reset form state
          setFormData({
            name: "",
            email: "",
            phone: "",
            organization: "",
            inquiryType: "",
            contactMethod: "email",
            urgency: "normal",
            message: "",
          });

          formRef.current?.reset();

          setStatus("success");
          setMessage(successText);

          // focus success banner for accessibility
          setTimeout(() => successBannerRef.current?.focus?.(), 100);

          // auto-hide success banner
          if (successTimerRef.current) clearTimeout(successTimerRef.current);
          successTimerRef.current = setTimeout(() => {
            if (isMounted.current) resetFormToIdle();
          }, 3000);

          return;
        }

        // non-2xx
        const errMsg = await parseErrorMessage(response);
        throw new Error(errMsg || `Server responded with status ${response.status}`);
      } catch (err: any) {
        if (!isMounted.current) return;

        console.error("Fetch error:", err);

        if (err?.name === "AbortError") {
          setStatus("error");
          setMessage("Network timeout. Please try again.");
        } else {
          setStatus("error");
          setMessage(err?.message || "Something went wrong. Please try again.");
        }
      } finally {
        // cleanup controller
        currentController.current = null;

        // Protect against stale closures — use the statusRef here
        if (pendingResetTimeoutRef.current) clearTimeout(pendingResetTimeoutRef.current);
        pendingResetTimeoutRef.current = setTimeout(() => {
          if (isMounted.current && statusRef.current === "sending") {
            console.warn("Request timed out - resetting status");
            setStatus("error");
            setMessage("Request timed out. Please try again.");
          }
        }, FETCH_TIMEOUT + 2000);
      }
    },
    [API_BASE_URL, doPostWithTimeout, formData, parseErrorMessage, resetFormToIdle]
  );

  const handleCancel = useCallback(() => {
    if (currentController.current) {
      currentController.current.abort();
    }
    setStatus("idle");
    setMessage("Request canceled.");
  }, []);

  const closeSuccessModal = useCallback(() => {
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    setStatus("idle");
    setMessage("");
  }, []);

  const closeError = useCallback(() => {
    setStatus("idle");
    setMessage("");
  }, []);

  // ---------- Data arrays (kept identical to your original structure) ----------
  const contactInfo = [
    { icon: Mail, title: "Email Support", primary: "bitcodes.global@gmail.com", secondary: "ismailmansury9737@gmail.com", description: "Get responses within 24 hours" },
    { icon: Phone, title: "Phone Support", primary: "+91 94287 67709", secondary: "+91 94287 67709", description: "Mon-Fri, 9:00 AM - 6:00 PM IST" },
    { icon: MapPin, title: "Headquarters", primary: "Bitcodes Academy", secondary: "Ahmedabad, Gujarat, India", description: "Visit our Academy center" },
    { icon: Clock, title: "Response Time", primary: "< 24 Hours", secondary: "< 2 Hours (Premium)", description: "We value your time" },
  ];

  const features = [
    { icon: Brain, title: "AI-Powered Learning", description: "Advanced algorithms personalize your learning journey", stats: "95% Success Rate" },
    { icon: Target, title: "Mock Test Excellence", description: "Comprehensive test preparation with detailed analytics", stats: "50,000+ Questions" },
    { icon: Users, title: "Expert Mentorship", description: "Learn from industry professionals and top educators", stats: "100+ Mentors" },
    { icon: Award, title: "Proven Results", description: "Students consistently achieve their target scores", stats: "10,000+ Success Stories" },
  ];

  const services = [
    { title: "AI Mock Tests", description: "Adaptive testing with real-time performance analysis", features: ["JEE/NEET Preparation", "Personalized Questions", "Instant Results"], popular: true },
    { title: "Premium Analytics", description: "Deep insights into your learning patterns and progress", features: ["Performance Tracking", "Weakness Analysis", "Study Recommendations"] },
    { title: "Enterprise Solutions", description: "Custom learning management systems for institutions", features: ["Bulk User Management", "Custom Branding", "Advanced Reporting"] },
    { title: "Mentorship Programs", description: "One-on-one guidance from subject matter experts", features: ["Personal Mentoring", "Career Guidance", "Interview Preparation"] },
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "JEE Aspirant", content: "Bitcodes AI tests helped me identify my weak areas and improve systematically. Scored 98.2 percentile!", rating: 5, course: "JEE Preparation" },
    { name: "Rajesh Kumar", role: "NEET Student", content: "The personalized learning path was game-changing. The AI recommendations were spot-on.", rating: 5, course: "NEET Preparation" },
    { name: "Anita College", role: "Educational Institution", content: "Bitcodes enterprise solution transformed our online testing capabilities. Highly recommended!", rating: 5, course: "Enterprise" },
  ];

  // ------------------ UI ------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Success Notification Banner */}
      {status === "success" && (
        <div
          ref={successBannerRef}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-2xl px-4 animate-in slide-in-from-top duration-300"
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
        >
          <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white rounded-xl shadow-2xl p-5 border-2 border-white/30 backdrop-blur-sm relative overflow-hidden">
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-white animate-bounce" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-yellow-300 animate-pulse" />
                    Message Sent Successfully!
                  </h3>
                  <p className="text-white/90 text-sm mt-1">{message}</p>
                </div>
              </div>
              <button onClick={closeSuccessModal} className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors ml-4" aria-label="Close success message">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
              <div className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400 animate-progress" style={{ animation: 'progress 3s linear forwards', width: '100%' }} />
            </div>

            <style jsx>{`\n              @keyframes progress {\n                from { width: 100%; }\n                to { width: 0%; }\n              }\n              .animate-progress { animation: progress 3s linear forwards; }\n            `}</style>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Code className="w-12 h-12 text-white mr-4" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-bounce" />
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">Bitcodes<span className="text-yellow-300">.com</span></h1>
            </div>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">Revolutionizing Education with AI-Powered Learning Solutions</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[{ id: "contact", label: "Contact Us", icon: MessageSquare }, { id: "services", label: "Our Services", icon: Zap }, { id: "testimonials", label: "Success Stories", icon: Star }].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === "contact" && (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50 relative">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"><Send className="w-8 h-8 text-white" /></div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Get in Touch</h2>
                  <p className="text-gray-600 text-lg">Let&apos;s discuss how AI can transform your learning journey</p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input aria-label="Your full name" type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your Full Name" required disabled={status === "sending"} className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all placeholder-gray-500" />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input aria-label="Your email address" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Your Email Address" required disabled={status === "sending"} className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all placeholder-gray-500" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input aria-label="Phone number" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number (Optional)" disabled={status === "sending"} className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all placeholder-gray-500" />
                    </div>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input aria-label="Organization" type="text" name="organization" value={formData.organization} onChange={handleInputChange} placeholder="School/Organization" disabled={status === "sending"} className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all placeholder-gray-500" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="relative">
                      <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select name="inquiryType" value={formData.inquiryType} onChange={handleInputChange} required disabled={status === "sending"} className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all appearance-none">
                        <option value="">Select Inquiry Type</option>
                        <option value="Mock Tests">AI Mock Tests</option>
                        <option value="Premium Plans">Premium Subscription</option>
                        <option value="Enterprise">Enterprise Solutions</option>
                        <option value="Mentorship">Mentorship Programs</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Partnership">Partnership Opportunities</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="relative">
                      <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select name="contactMethod" value={formData.contactMethod} onChange={handleInputChange} required disabled={status === "sending"} className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all appearance-none">
                        <option value="email">Email</option>
                        <option value="phone">Phone Call</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="video-call">Video Call</option>
                      </select>
                    </div>
                  </div>

                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select name="urgency" value={formData.urgency} onChange={handleInputChange} disabled={status === "sending"} className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all appearance-none">
                      <option value="normal">Normal Priority</option>
                      <option value="urgent">Urgent (within 24 hours)</option>
                      <option value="high">High Priority (within 12 hours)</option>
                    </select>
                  </div>

                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea aria-label="Message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us about your requirements, goals, or questions..." rows={6} required disabled={status === "sending"} className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all resize-none placeholder-gray-500" />
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" aria-busy={status === "sending"} disabled={status === "sending"} className="flex-1 w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                      {status === "sending" ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span className="text-lg">Sending Your Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6" />
                          <span className="text-lg">Send Message</span>
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    {status === "sending" && (
                      <button type="button" onClick={handleCancel} className="px-4 py-4 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
                    )}
                  </div>

                  {status === "error" && message && (
                    <div className="mt-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 relative">
                      <button onClick={closeError} className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors" aria-label="Close error message">
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                      <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-red-800 font-semibold">Message Failed</p>
                        <p className="text-red-700 text-sm mt-1">{message}</p>
                      </div>
                    </div>
                  )}
                </form>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center"><Shield className="w-4 h-4 mr-2 text-green-500" /><span>SSL Secured</span></div>
                    <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-blue-500" /><span>24hr Response</span></div>
                    <div className="flex items-center"><Star className="w-4 h-4 mr-2 text-yellow-500" /><span>Premium Support</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <info.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-900 mb-1">{info.title}</h4>
                        <p className="text-gray-800 font-medium">{info.primary}</p>
                        <p className="text-gray-600 text-sm">{info.secondary}</p>
                        <p className="text-gray-500 text-sm mt-1">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Why Choose Bitcodes?</h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 bg-white/60 rounded-xl">
                      <div className="flex-shrink-0"><feature.icon className="w-8 h-8 text-blue-600" /></div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                        <p className="text-gray-700 text-xs leading-relaxed">{feature.description}</p>
                        <p className="text-blue-600 font-semibold text-xs mt-1">{feature.stats}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our AI-Powered Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Comprehensive learning solutions designed to help students and institutions achieve excellence</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div key={index} className={`relative group ${service.popular ? "transform scale-105" : ""}`}>
                  {service.popular && (
                    <div className="absolute -top-4 -right-4 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">MOST POPULAR</div>
                    </div>
                  )}

                  <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-8 border transition-all duration-300 hover:shadow-2xl hover:scale-105 ${service.popular ? "border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50" : "border-white/50"}`}>
                    <div className="flex items-center mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${service.popular ? "bg-gradient-to-r from-yellow-500 to-orange-500" : "bg-gradient-to-r from-blue-500 to-purple-600"}`}>
                        {service.popular ? <Star className="w-6 h-6 text-white" /> : <Zap className="w-6 h-6 text-white" />}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">{service.description}</p>

                    <div className="space-y-3 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button className={`w-full py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${service.popular ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600" : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"}`}>Learn More</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === "testimonials" && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Real results from students who transformed their learning with Bitcodes AI</p>
              <div className="flex items-center justify-center mt-6 space-x-8">
                <div className="text-center"><div className="text-3xl font-bold text-blue-600">50,000+</div><div className="text-sm text-gray-600">Students Served</div></div>
                <div className="text-center"><div className="text-3xl font-bold text-green-600">95%</div><div className="text-sm text-gray-600">Success Rate</div></div>
                <div className="text-center"><div className="text-3xl font-bold text-purple-600">4.9/5</div><div className="text-sm text-gray-600">Average Rating</div></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/50 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4"><Users className="w-6 h-6 text-white" /></div>
                    <div><h4 className="font-bold text-gray-900">{testimonial.name}</h4><p className="text-sm text-gray-600">{testimonial.role}</p></div>
                  </div>
                  <div className="flex mb-4">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />))}</div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{testimonial.content}</p>
                  <p className="text-sm text-gray-500">Course: {testimonial.course}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
