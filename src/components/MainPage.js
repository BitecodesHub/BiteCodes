import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, ArrowRight, CheckCircle, Clock, Users, Trophy, Moon, Sun } from "lucide-react";
import Navbar from "./Navbar";

export default function HomePage() {
  const [remainingSpots, setRemainingSpots] = useState(7);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 10 });
  const [theme, setTheme] = useState("dark");
  const [isOfferVisible, setIsOfferVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", company: "" });

  // Theme setup and detection
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }, []);

  // Apply theme class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.days === 0 && prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          return prev;
        }
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
              days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Show offer popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsOfferVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Inject custom CSS styles
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .marquee {
        white-space: nowrap;
        overflow: hidden;
      }
      .marquee-content {
        display: inline-block;
        animation: marquee 15s linear infinite;
      }
      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      .offer-pulse {
        animation: offerPulse 2s infinite;
      }
      @keyframes offerPulse {
        0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
        70% { box-shadow: 0 0 0 12px rgba(212, 175, 55, 0); }
        100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
      }
      .bg-grid {
        background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
        background-size: 24px 24px;
      }
      .dark .bg-grid {
        background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
      }
      .gradient-text {
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        background-image: linear-gradient(to right, #d4af37, #f0e68c);
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // Clients data
  const clients = [
    { name: "Rivala", logo: "/logos/Rivala Logo Final-01.png", website: "https://rivala.com" },
    { name: "TechFirm", logo: "/logos/Rivala Logo Final-01.png", website: "#" },
    { name: "GrowthCorp", logo: "/logos/Rivala Logo Final-01.png", website: "#" },
  ];

  // Services data
  const services = [
    {
      title: "Web Development",
      description: "Bespoke websites with elegant design and robust functionality.",
      icon: <Code className="text-gold-400" />,
    },
    {
      title: "Mobile Apps",
      description: "Seamless native and cross-platform apps for superior user experiences.",
      icon: <Code className="text-gold-400" />,
    },
    {
      title: "UI/UX Design",
      description: "Intuitive, user-centric designs that elevate engagement and conversions.",
      icon: <Code className="text-gold-400" />,
    },
  ];

  // Form handlers
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    form.append("access_key", "87c6a13e-cb0a-4053-991b-c8c151167bff");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", company: "" });
        setTimeout(() => setIsSubmitted(false), 2500);
      } else {
        console.error("Form submission failed:", response.statusText);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 dark:bg-gray-950 text-gray-100 font-sans transition-colors duration-500">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed right-4 top-4 z-50 p-2 rounded-full bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 shadow-md hover:scale-110 transition-all duration-300"
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {/* Special Offer Popup */}
      <AnimatePresence>
        {isOfferVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-14 left-4 right-4 z-50 mx-auto max-w-sm sm:max-w-md"
          >
            <div className="bg-gray-900/90 backdrop-blur-lg border border-gray-700/50 rounded-xl p-4 text-gray-100 shadow-2xl flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <Clock size={20} className="text-gold-400" />
                <div>
                  <p className="font-semibold text-sm">Exclusive Offer!</p>
                  <p className="text-xs">Premium Website for ₹1,999</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => document.getElementById("claim-offer").scrollIntoView({ behavior: "smooth" })}
                  className="bg-gold-400 text-gray-900 px-3 py-1 rounded-md text-xs font-medium hover:bg-gold-300 transition"
                >
                  View
                </button>
                <button
                  onClick={() => setIsOfferVisible(false)}
                  className="bg-gray-800/50 px-2 py-1 rounded-md text-xs hover:bg-gray-700/50 transition"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Breaking News Banner */}
      <div className="bg-gray-900 dark:bg-gray-900 text-white pt-20 w-full overflow-hidden">
        <div className="marquee py-2">
          <div className="marquee-content text-sm sm:text-base">
            🔥 EXCLUSIVE OFFER: Premium Website for ₹1,999! 🔥 LIMITED SLOTS: Only 7 Remaining! 🔥 HURRY: 3 Days Left! 🔥
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gray-950">
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        <div className="absolute top-10 left-10 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-silver-400/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="pt-0 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-gray-100"
            >
              <span className="gradient-text">Crafting Digital</span>
              <br />
              Masterpieces
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 text-xl text-gray-400 leading-relaxed"
            >
              We sculpt sophisticated software solutions that empower businesses to excel. From exquisite websites to dynamic apps, we deliver perfection in every detail.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex flex-wrap gap-4 justify-center"
            >
              <a
                href="#claim-offer"
                className="px-8 py-4 border bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-gray-300 font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group offer-pulse"
              >
                Start Your Journey
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#services"
                className="px-8 py-4 bg-gray-800/80 text-gray-100 font-medium rounded-full shadow-md hover:shadow-xl backdrop-blur-sm transition-all duration-300 border border-gray-700 hover:bg-gray-700"
              >
                Explore Services
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6"
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800/50 mb-3">
                  <Trophy size={24} className="text-gold-400" />
                </div>
                <p className="text-xl font-bold text-gray-100">99%</p>
                <p className="text-sm text-gray-500">Client Satisfaction</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800/50 mb-3">
                  <Code size={24} className="text-gold-400" />
                </div>
                <p className="text-xl font-bold text-gray-100">10+</p>
                <p className="text-sm text-gray-500">Projects Delivered</p>
              </div>
              <div className="flex flex-col items-center col-span-2 md:col-span-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800/50 mb-3">
                  <Users size={24} className="text-gold-400" />
                </div>
                <p className="text-xl font-bold text-gray-100">2+ Years</p>
                <p className="text-sm text-gray-500">Industry Expertise</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Limited Time Offer */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 bg-gray-900/50 backdrop-blur-lg border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-4 tracking-tight">
              Exclusive Offer: Website for ₹1,999
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mb-6 leading-relaxed">
              Elite web development at an unprecedented price. Limited to the first 20 visionaries!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {["Custom Design", "Mobile Responsive", "SEO Optimization", "1 Year Support"].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle size={20} className="text-gold-400 mr-2" />
                  <span className="text-gray-100 text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <a
              href="#claim-offer"
              className="inline-flex items-center px-6 py-2 bg-gold-400 text-gray-900 text-sm font-medium rounded-lg shadow-md hover:bg-gold-300 transition-all duration-300"
            >
              Secure Offer
              <ArrowRight size={16} className="ml-2" />
            </a>
          </div>
          <div className="lg:w-1/3 bg-gray-900/50 backdrop-blur-lg border border-gray-800/50 rounded-2xl p-6 sm:p-8 flex flex-col justify-center">
            <div className="text-center mb-4">
              <div className="text-gray-100 text-sm font-medium mb-2">Exclusive Slots</div>
              <div className="text-2xl font-bold text-gray-100">
                {remainingSpots} <span className="text-gray-500">/ 20</span>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full mt-2">
                <div
                  className="bg-gold-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(remainingSpots / 20) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="text-gray-100 text-sm font-medium mb-2 flex items-center justify-center">
                <Clock size={16} className="mr-1 text-gold-400" />
                Offer Expires In:
              </div>
              <div className="flex justify-center space-x-2 sm:space-x-3">
                {["days", "hours", "minutes"].map((unit, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-gray-800 rounded-lg p-2 w-12 sm:w-14">
                      <div className="text-lg sm:text-xl font-bold text-gray-100">{timeLeft[unit]}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 capitalize">{unit}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Claim Offer Form */}
          <div id="claim-offer" className="lg:w-full bg-gray-900/50 backdrop-blur-lg border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-6 text-center">Secure Your Exclusive Offer</h3>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-400">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all duration-300"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all duration-300"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-xs font-medium text-gray-400">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all duration-300"
                  placeholder="Your Company"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-2 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-gray-900 text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Claim Now
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 tracking-tight">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed mt-2">
              Comprehensive digital solutions to propel your business forward.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 p-6"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800/50 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-100 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{service.description}</p>
                <a
                  href={`/services#${service.title.toLowerCase().replace(" ", "-")}`}
                  className="inline-flex items-center text-gold-400 text-sm font-medium hover:text-gold-300 transition-colors duration-300 mt-4"
                >
                  Learn More
                  <ArrowRight size={14} className="ml-1" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 tracking-tight">
              Why Choose <span className="gradient-text">BiteCodes</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed mt-2">
              Unparalleled expertise meets innovative design for exceptional results.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Elite Team", description: "World-class developers and designers", icon: <Users className="text-gold-400" /> },
              { title: "Bespoke Solutions", description: "Crafted to your vision", icon: <Code className="text-gold-400" /> },
              { title: "Impeccable Quality", description: "Perfection in every detail", icon: <CheckCircle className="text-gold-400" /> },
              { title: "Dedicated Support", description: "Ongoing partnership", icon: <Clock className="text-gold-400" /> },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 p-6"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 mb-3">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-gray-100 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-12 sm:py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 tracking-tight">
              Trusted by <span className="gradient-text">Visionaries</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed mt-2">
              Collaborating with pioneering companies across industries.
            </p>
          </div>
          <div className="relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
            <motion.div
              className="flex space-x-12 sm:space-x-16 py-6"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              {[...clients, ...clients].map((client, index) => (
                <motion.a
                  key={index}
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                >
                  <img src={client.logo} alt={client.name} className="h-16 sm:h-20 md:h-20 object-contain" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Offer Button */}
      <button
        onClick={() => document.getElementById("claim-offer").scrollIntoView({ behavior: "smooth" })}
        className="fixed left-4 bottom-8 border sm:bottom-20 z-50 px-4 py-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 text-gray-300 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 offer-pulse"
      >
        ₹1,999 Exclusive Offer
      </button>
    </div>
  );
}