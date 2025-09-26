"use client";
import { useState } from "react";
import { 
  Loader2, CheckCircle2, AlertCircle, Mail, User, BookOpen, MessageSquare, 
  Phone, MapPin, Clock, Send, Star, Shield, Award, Users, Brain, Target,
  ChevronRight, ExternalLink, Zap, Globe, HeadphonesIcon, MessageCircle,
  GraduationCap, TrendingUp, Lightbulb, Code, Sparkles
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function EnhancedContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("contact");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    
    const formData = new FormData(e.currentTarget);
    
    // Enhanced form data for bitcodes.com
    formData.append("access_key", "610ab766-0a22-4922-9b13-d3d028b77ad6");
    formData.append("subject", "New Inquiry from Bitcodes Academy Visitor");
    formData.append("from_name", formData.get("name") as string);
    formData.append("from_email", formData.get("email") as string);
    formData.append("reply_to", formData.get("email") as string);
    formData.append("tags", "bitcodes,contact,ai-learning,inquiry,support");
    formData.append("redirect", "https://bitcodes.com/thank-you");
    formData.append("page_url", window.location.href);
    formData.append("user_agent", navigator.userAgent);
    formData.append("inquiry_type", formData.get("inquiryType") as string);
    formData.append("organization", formData.get("organization") ? (formData.get("organization") as string) : "Individual");
    formData.append("preferred_contact_method", formData.get("contactMethod") as string);
    formData.append("urgency_level", formData.get("urgency") as string);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setStatus("success");
        setMessage("Thank you! We'll get back to you within 24 hours.");
        toast.success("Message sent successfully! Our team will respond soon.", {
          icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
          duration: 6000,
        });
        e.currentTarget.reset();
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 8000);
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
      toast.error(err.message || "Failed to send message", {
        icon: <AlertCircle className="w-5 h-5 text-red-600" />,
        duration: 5000,
      });
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      primary: "bitcodes.global@gmail.com",
      secondary: "ismailmansury9737@gmail.com",
      description: "Get responses within 24 hours"
    },
    {
      icon: Phone,
      title: "Phone Support",
      primary: "+91 94287 67709",
      secondary: "+91 94287 67709",
      description: "Mon-Fri, 9:00 AM - 6:00 PM IST"
    },
    {
      icon: MapPin,
      title: "Headquarters",
      primary: "Bitcodes Academy",
      secondary: "Ahmedabad, Gujarat, India",
      description: "Visit our Academy center"
    },
    {
      icon: Clock,
      title: "Response Time",
      primary: "< 24 Hours",
      secondary: "< 2 Hours (Premium)",
      description: "We value your time"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Advanced algorithms personalize your learning journey",
      stats: "95% Success Rate"
    },
    {
      icon: Target,
      title: "Mock Test Excellence",
      description: "Comprehensive test preparation with detailed analytics",
      stats: "50,000+ Questions"
    },
    {
      icon: Users,
      title: "Expert Mentorship",
      description: "Learn from industry professionals and top educators",
      stats: "100+ Mentors"
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "Students consistently achieve their target scores",
      stats: "10,000+ Success Stories"
    }
  ];

  const services = [
    {
      title: "AI Mock Tests",
      description: "Adaptive testing with real-time performance analysis",
      features: ["JEE/NEET Preparation", "Personalized Questions", "Instant Results"],
      popular: true
    },
    {
      title: "Premium Analytics",
      description: "Deep insights into your learning patterns and progress",
      features: ["Performance Tracking", "Weakness Analysis", "Study Recommendations"]
    },
    {
      title: "Enterprise Solutions",
      description: "Custom learning management systems for institutions",
      features: ["Bulk User Management", "Custom Branding", "Advanced Reporting"]
    },
    {
      title: "Mentorship Programs",
      description: "One-on-one guidance from subject matter experts",
      features: ["Personal Mentoring", "Career Guidance", "Interview Preparation"]
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "JEE Aspirant",
      content: "Bitcodes AI tests helped me identify my weak areas and improve systematically. Scored 98.2 percentile!",
      rating: 5,
      course: "JEE Preparation"
    },
    {
      name: "Rajesh Kumar",
      role: "NEET Student",
      content: "The personalized learning path was game-changing. The AI recommendations were spot-on.",
      rating: 5,
      course: "NEET Preparation"
    },
    {
      name: "Anita College",
      role: "Educational Institution",
      content: "Bitcodes enterprise solution transformed our online testing capabilities. Highly recommended!",
      rating: 5,
      course: "Enterprise"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Code className="w-12 h-12 text-white mr-4" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-bounce" />
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
                Bitcodes<span className="text-yellow-300">.com</span>
              </h1>
            </div>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Revolutionizing Education with AI-Powered Learning Solutions
            </p>
        
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: "contact", label: "Contact Us", icon: MessageSquare },
              { id: "services", label: "Our Services", icon: Zap },
              { id: "testimonials", label: "Success Stories", icon: Star }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Get in Touch</h2>
                  <p className="text-gray-600 text-lg">
                    Let's discuss how AI can transform your learning journey
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Full Name"
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all placeholder-gray-500"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email Address"
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number (Optional)"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all placeholder-gray-500"
                      />
                    </div>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="organization"
                        placeholder="School/Organization"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="relative">
                      <Target className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="inquiryType"
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all appearance-none"
                      >
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
                      <MessageCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="contactMethod"
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all appearance-none"
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone Call</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="video-call">Video Call</option>
                      </select>
                    </div>
                  </div>

                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="urgency"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all appearance-none"
                    >
                      <option value="normal">Normal Priority</option>
                      <option value="urgent">Urgent (within 24 hours)</option>
                      <option value="high">High Priority (within 12 hours)</option>
                    </select>
                  </div>

                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                      name="message"
                      placeholder="Tell us about your requirements, goals, or questions..."
                      rows={6}
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white/80 transition-all resize-none placeholder-gray-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
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

                  {/* Status Messages */}
                  {status === "success" && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 flex items-center animate-fadeIn">
                      <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
                      <div>
                        <p className="text-green-800 font-semibold">Message Sent Successfully!</p>
                        <p className="text-green-700 text-sm">{message}</p>
                      </div>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4 flex items-center animate-fadeIn">
                      <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                      <div>
                        <p className="text-red-800 font-semibold">Message Failed</p>
                        <p className="text-red-700 text-sm">{message}</p>
                      </div>
                    </div>
                  )}
                </form>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-green-500" />
                      <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      <span>24hr Response</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2 text-yellow-500" />
                      <span>Premium Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information & Features */}
            <div className="lg:col-span-1 space-y-8">
              {/* Contact Info */}
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

              {/* Key Features */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Why Choose Bitcodes?</h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 bg-white/60 rounded-xl">
                      <div className="flex-shrink-0">
                        <feature.icon className="w-8 h-8 text-blue-600" />
                      </div>
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
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive learning solutions designed to help students and institutions achieve excellence
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div key={index} className={`relative group ${service.popular ? 'transform scale-105' : ''}`}>
                  {service.popular && (
                    <div className="absolute -top-4 -right-4 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        MOST POPULAR
                      </div>
                    </div>
                  )}
                  
                  <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-8 border transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                    service.popular ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' : 'border-white/50'
                  }`}>
                    <div className="flex items-center mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                        service.popular 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-600'
                      }`}>
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
                    
                    <button className={`w-full py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                      service.popular
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    }`}>
                      Learn More
                    </button>
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
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real results from students who transformed their learning with Bitcodes AI
              </p>
              <div className="flex items-center justify-center mt-6 space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">50,000+</div>
                  <div className="text-sm text-gray-600">Students Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">4.9/5</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/50 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
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