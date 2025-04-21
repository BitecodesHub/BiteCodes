import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Clock, Moon, Sun } from "lucide-react";
import Navbar from "./Navbar";
import Particles from "react-tsparticles";

export default function APIDevelopmentPage() {
  const [theme, setTheme] = useState("light");
  const [activeSection, setActiveSection] = useState("Development");
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

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
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Inject custom CSS styles
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .neon-text {
        text-shadow: 0 0 10px rgba(109, 40, 217, 0.7), 0 0 20px rgba(147, 51, 234, 0.7), 0 0 30px rgba(186, 104, 200, 0.7);
        animation: neonPulse 1.5s infinite alternate;
      }
      .holographic {
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(147, 51, 234, 0.5), 0 0 30px rgba(109, 40, 217, 0.7);
        animation: holographicFlicker 2s infinite;
      }
      .glow {
        box-shadow: 0 0 15px rgba(99, 102, 241, 0.5), 0 0 30px rgba(147, 51, 234, 0.5);
      }
      .animate-pulse-slow {
        animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      .animate-spin-slow {
        animation: spin 4s linear infinite;
      }
      @keyframes neonPulse {
        from { text-shadow: 0 0 5px rgba(109, 40, 217, 0.5), 0 0 10px rgba(147, 51, 234, 0.5); }
        to { text-shadow: 0 0 10px rgba(109, 40, 217, 0.7), 0 0 20px rgba(147, 51, 234, 0.7); }
      }
      @keyframes holographicFlicker {
        0% { opacity: 1; }
        10% { opacity: 0.9; }
        20% { opacity: 1; }
        30% { opacity: 0.95; }
        100% { opacity: 1; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  function calculateTimeLeft() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 7 days from now
    const difference = endDate - new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 15, stiffness: 100 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 200 },
    },
  };

  // Split headline into letters
  const headline = "Premium API Development";
  const headlineLetters = headline.split("");

  // Pricing and service data
  const services = [
    { title: "Custom API Design", desc: "Tailored APIs for seamless integration and performance." },
    { title: "API Integration", desc: "Connect your apps with robust API solutions." },
    { title: "Performance Optimization", desc: "Enhance API speed and reliability." },
    { title: "Maintenance & Support", desc: "Ongoing API updates and technical support." },
  ];

  const pricingData = {
    Development: [
      { title: "Basic API", price: "₹5,000 - ₹20,000", features: ["REST API", "Basic Endpoints", "Documentation"] },
      { title: "Advanced API", price: "₹20,000 - ₹35,000", features: ["REST/GraphQL", "Authentication", "Rate Limiting"] },
      { title: "Enterprise API", price: "₹35,000 - ₹50,000", features: ["Scalable Architecture", "Custom Integrations", "Analytics"] },
    ],
    Services: [
      { title: "API Integration", price: "₹10,000 - ₹30,000", features: ["Third-Party APIs", "Data Mapping", "Testing"] },
      { title: "API Security", price: "₹15,000 - ₹40,000", features: ["OAuth Setup", "Encryption", "Compliance"] },
      { title: "API Optimization", price: "₹10,000 - ₹25,000", features: ["Performance Tuning", "Caching", "Monitoring"] },
      { title: "Documentation", price: "₹5,000 - ₹15,000", features: ["API Docs", "Usage Guides", "Tutorials"] },
    ],
  };

  const testimonials = [
    { name: "Rohan Desai", text: "Their APIs boosted our app’s performance significantly!", rating: 5 },
    { name: "Anjali Nair", text: "Seamless integration and excellent support.", rating: 5 },
    { name: "Kiran Patel", text: "Reliable and efficient API solutions.", rating: 4 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-500 overflow-hidden">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed right-6 bottom-6 z-50 p-3 rounded-full bg-indigo-100/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border border-indigo-300 dark:border-gray-600 glow"
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <Particles
          id="particles"
          options={{
            background: { color: { value: theme === "light" ? "#f3f4f6" : "#1e293b" } },
            particles: {
              number: { value: 80, density: { enable: true, value_area: 800 } },
              color: { value: theme === "light" ? "#4c1d95" : "#a78bfa" },
              shape: { type: "circle" },
              opacity: { value: 0.5 },
              size: { value: 3 },
              move: { enable: true, speed: 2 },
            },
          }}
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              variants={containerVariants}
              className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-300 dark:to-violet-300">
                {headlineLetters.map((letter, index) => (
                  <motion.span key={index} variants={letterVariants}>
                    {letter}
                  </motion.span>
                ))}
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mt-6 text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              Building robust and scalable APIs to power your applications.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-8">
              <motion.a
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white/80 dark:bg-gray-800/80 text-indigo-600 dark:text-indigo-300 font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 border border-indigo-200 dark:border-gray-600"
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
                <ArrowRight size={20} className="ml-2" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Showcase */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/50 dark:to-violet-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-12"
          >
            Tailored <span className="text-violet-600 dark:text-violet-400">API Pricing Plans</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingData[activeSection].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 shadow-xl hover:shadow-2xl hover:glow transition-all duration-300 border border-indigo-200/50 dark:border-indigo-800/50"
              >
                <h3 className="text-xl md:text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
                  {plan.title}
                </h3>
                <p className="text-2xl md:text-3xl font-extrabold text-violet-600 dark:text-violet-400 mb-6">
                  {plan.price}
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Check className="text-green-500" size={18} />
                      <span className="transition-transform duration-300 hover:translate-x-2">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <motion.button
              onClick={() => setActiveSection(activeSection === "Development" ? "Services" : "Development")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeSection === "Development" ? "View Services" : "View Development"}
            </motion.button>
          </div>
        </div>
      </section>

      {/* Limited Time Offer */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 to-violet-700 dark:from-indigo-900 dark:to-violet-900 animate-pulse-slow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_rgba(0,0,0,0.2)_70%)] dark:bg-[radial-gradient(circle_at_center,_rgba(109,40,217,0.2)_0%,_rgba(0,0,0,0.4)_70%)]"></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, type: "spring" }}
            className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl rounded-2xl p-6 md:p-10 shadow-2xl border border-indigo-300/30 dark:border-indigo-700/30 relative z-10"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 neon-text">
              Limited Time Offer!
            </h2>
            <p className="text-xl md:text-2xl text-yellow-300 mb-6">
              Get a Custom API Package for Only <span className="text-4xl font-bold">₹4,999</span>!
            </p>
            <div className="flex justify-center gap-4 text-white mb-8">
              <span className="text-2xl font-bold">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </span>
              <Clock className="animate-spin text-indigo-200" size={28} />
            </div>
            <motion.a
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-400 to-violet-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 glow"
              whileHover={{ scale: 1.1, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              Grab This Deal
              <ArrowRight size={20} className="ml-2" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}