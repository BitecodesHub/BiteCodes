import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, ArrowRight, CheckCircle, Clock, Users, Trophy, Moon, Sun } from "lucide-react";
import Navbar from "./Navbar";

export default function HomePage() {
  const [remainingSpots, setRemainingSpots] = useState(7);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 10 });
  const [theme, setTheme] = useState("light");
  const [isOfferVisible, setIsOfferVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Theme setup and detection
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setTheme(mediaQuery.matches ? "dark" : "light");
      const handleChange = (e) => setTheme(e.matches ? "dark" : "light");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Apply theme class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, []);

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
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Show offer popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOfferVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Inject custom CSS styles for marquee
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .marquee {
        white-space: nowrap;
        overflow: hidden;
      }
      
      .marquee-content {
        display: inline-block;
        animation: marquee 20s linear infinite;
      }
      
      @keyframes marquee {
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(-100%);
        }
      }
      
      .offer-pulse {
        animation: offerPulse 2s infinite;
      }
      
      @keyframes offerPulse {
        0% {
          box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
        }
        70% {
          box-shadow: 0 0 0 15px rgba(139, 92, 246, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
        }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // Clients data
  const clients = [
    { name: "Rivala", logo: "/logos/Rivala Logo Final-01.png", website: "https://rivala.com" },
    { name: "TechFirm", logo: "/logos/Rivala Logo Final-01.png", website: "#" },
    { name: "GrowthCorp", logo: "/logos/Rivala Logo Final-01.png", website: "#" }
  ];
  
  // Services data
  const services = [
    {
      title: "Web Development",
      description: "Custom websites with stunning design and powerful functionality",
      icon: <Code className="text-indigo-500 dark:text-indigo-400" />,
    },
    {
      title: "Mobile Apps",
      description: "Native and cross-platform apps for exceptional user experiences",
      icon: <Code className="text-purple-500 dark:text-purple-400" />,
    },
    {
      title: "UI/UX Design",
      description: "User-centered design that drives engagement and conversions",
      icon: <Code className="text-pink-500 dark:text-pink-400" />,
    },
  ];

  // Form state
  const [formData, setFormData] = useState({ name: "", email: "", company: "" });
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
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setIsSubmitted(false), 2500);
      } else {
        console.error("Form submission failed:", response.statusText);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed right-4 bottom-4 z-50 p-3 rounded-full bg-indigo-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg hover:scale-110 transition-all duration-300"
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      {/* Special Offer Popup */}
      <AnimatePresence>
        {isOfferVisible && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-5 text-white shadow-2xl flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Clock size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-bold">Limited Time Offer!</p>
                  <p className="text-sm">Get a stunning website for only ₹1,999</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => document.getElementById('claim-offer').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-indigo-600 px-3 py-1 rounded-lg font-bold hover:bg-indigo-100 transition"
                >
                  View
                </button>
                <button 
                  onClick={() => setIsOfferVisible(false)}
                  className="bg-white/10 px-2 py-1 rounded-lg hover:bg-white/20 transition"
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
      <div className="bg-indigo-600 dark:bg-indigo-800 text-white pt-16 w-full overflow-hidden">
        <div className="marquee py-1">
          <div className="marquee-content">
            🔥 LIMITED TIME OFFER: Get a stunning professional website for only ₹1,999! 🔥 FLASH SALE: Premium Web Design at 90% OFF! 🔥 HURRY: Only 7 days remaining on our best deal ever! 🔥 
          </div>
        </div>
      </div>
 
      {/* Hero Section */}
      <section className="relative py-24 md:py-28 overflow-hidden bg-gradient-to-br from-indigo-50 to-violet  dark:from-indigo-900 dark:to-violet-900">
        <div className="absolute inset-0 bg-grid-gray-100/20 dark:bg-grid-gray-800/10 bg-[length:24px_24px]"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-400/10 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                Transforming Ideas
              </span>
              <br />
              Into Digital Excellence
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              We craft cutting-edge software solutions to help businesses thrive. From stunning websites to powerful apps, we deliver excellence at every pixel.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex flex-wrap gap-4 justify-center"
            >
              <a
                href="#claim-offer"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group offer-pulse"
              >
                Get Started
                <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#services"
                className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 font-medium rounded-full shadow-md hover:shadow-xl backdrop-blur-sm transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700"
              >
                Our Services
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6"
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-3">
                  <Trophy size={24} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">98%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Client Satisfaction</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/50 mb-3">
                  <Code size={24} className="text-violet-600 dark:text-violet-400" />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">300+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Projects Delivered</p>
              </div>
              <div className="flex flex-col items-center col-span-2 md:col-span-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 mb-3">
                  <Users size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">10+ years</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Industry Experience</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Limited Time Offer */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-900 dark:to-violet-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
                  Limited Time Offer: Get Your Website for Only ₹1,999
                </h2>
                <p className="text-indigo-100 text-lg mb-6 leading-relaxed">
                  Premium web development at an unbeatable price. Only for the first 20 customers!
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[
                    "Custom Design",
                    "Mobile Responsive",
                    "SEO Optimization",
                    "1 Year Support",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle size={24} className="text-green-300 mr-3" />
                      <span className="text-white font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="#claim-offer"
                  className="inline-flex items-center px-8 py-3 bg-white text-indigo-600 dark:bg-gray-900 dark:text-indigo-400 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Claim Offer
                  <ArrowRight size={20} className="ml-2" />
                </a>
              </div>
              <div className="md:w-1/3 bg-white/20 dark:bg-gray-800/20 p-8 flex flex-col justify-center items-center">
                <div className="text-center mb-6">
                  <div className="text-white text-sm font-semibold mb-2">Limited Spots</div>
                  <div className="text-4xl font-extrabold text-white">
                    {remainingSpots} <span className="text-indigo-200">/ 20</span>
                  </div>
                  <div className="w-full bg-white/30 h-3 rounded-full mt-3">
                    <div
                      className="bg-white dark:bg-indigo-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(remainingSpots / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-white text-sm font-semibold mb-3 flex items-center justify-center">
                    <Clock size={18} className="mr-2" />
                    Offer Ends In:
                  </div>
                  <div className="flex justify-center space-x-4">
                    {["days", "hours", "minutes"].map((unit, index) => (
                      <div key={index} className="text-center">
                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 w-16">
                          <div className="text-2xl font-bold text-white">{timeLeft[unit]}</div>
                        </div>
                        <div className="text-sm text-indigo-100 mt-2 capitalize">{unit}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Claim Offer Form */}
            <div id="claim-offer" className="p-8 bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Claim Your Offer Now</h3>
              <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-indigo-100">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-4 py-3 bg-white/10 dark:bg-gray-800/10 border border-white/20 dark:border-gray-700/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-indigo-100">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-4 py-3 bg-white/10 dark:bg-gray-800/10 border border-white/20 dark:border-gray-700/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-indigo-100">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-3 bg-white/10 dark:bg-gray-800/10 border border-white/20 dark:border-gray-700/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your Company"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Submit Claim
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
              Our <span className="text-violet-600 dark:text-violet-400">Services</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We provide end-to-end digital solutions to help your business thrive.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="p-8">
                  <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-indigo-100/30 dark:bg-indigo-900/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{service.description}</p>
                </div>
                <div className="px-8 pb-8">
                  <a
                    href={`/services#${service.title.toLowerCase().replace(" ", "-")}`}
                    className="inline-flex items-center text-violet-600 dark:text-violet-400 font-semibold hover:text-violet-700 dark:hover:text-violet-300 transition-colors duration-300"
                  >
                    Learn more
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
              Why Choose <span className="text-violet-600 dark:text-violet-400">BiteCodes</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We combine technical excellence with creative innovation to deliver unmatched solutions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Expert Team",
                description: "Skilled developers and designers with years of experience",
                icon: <Users className="text-indigo-500 dark:text-indigo-400" />,
              },
              {
                title: "Custom Solutions",
                description: "Tailored development for your unique needs",
                icon: <Code className="text-violet-500 dark:text-violet-400" />,
              },
              {
                title: "Quality Assurance",
                description: "Rigorous testing for flawless functionality",
                icon: <CheckCircle className="text-green-500 dark:text-green-400" />,
              },
              {
                title: "Ongoing Support",
                description: "Continuous assistance to keep your solutions running",
                icon: <Clock className="text-pink-500 dark:text-pink-400" />,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-indigo-100/30 dark:bg-indigo-900/20 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
              Trusted by <span className="text-violet-600 dark:text-violet-400">Industry Leaders</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We've partnered with innovative companies across various industries.
            </p>
          </div>
          <div className="relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 dark:from-gray-800 to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-50 dark:from-gray-800 to-transparent z-10"></div>
            <motion.div
              className="flex space-x-20 py-8 items-center justify-center"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {[...clients, ...clients].map((client, index) => (
                <motion.a
                  key={index}
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    style={{ height: "120px", width: "180px" }}
                    className="object-contain"
                  />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Offer Button */}
      <button
        onClick={() => document.getElementById('claim-offer').scrollIntoView({ behavior: 'smooth' })}
        className="fixed left-6 bottom-20 z-50 p-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-xl hover:scale-110 transition-all duration-300 border border-white/20 offer-pulse"
      >
        <span className="px-2">₹1,999 OFFER!</span>
      </button>
    </div>
  );
}