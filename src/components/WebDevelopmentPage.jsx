import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Clock, Moon, Sun } from "lucide-react";
import Navbar from "./Navbar";
import Particles from "react-tsparticles"; // Ensure this is installed

export default function WebDevelopmentPage() {
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
  });

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
  const headline = "Premium Web Development";
  const headlineLetters = headline.split("");

  // Pricing and service data
  const services = [
    { title: "Custom Web Design", desc: "Tailored, responsive designs for your brand." },
    { title: "Dynamic Solutions", desc: "CMS and database-driven websites." },
    { title: "SEO Optimization", desc: "Boost your visibility with expert SEO." },
    { title: "Maintenance Plans", desc: "24/7 support and regular updates." },
  ];

  const pricingData = {
    Development: [
      { title: "Basic Website", price: "₹5,000 - ₹10,000", features: ["Basic Design", "5 Pages", "Responsive"] },
      { title: "Premium Website", price: "₹10,000 - ₹15,000", features: ["Advanced Design", "10 Pages", "Forms"] },
      { title: "Dynamic Website", price: "₹15,000 - ₹80,000", features: ["CMS", "Dynamic Content", "Database"] },
    ],
    Services: [
      { title: "Web Services", price: "₹10,000 - ₹25,000", features: ["API", "Optimization", "Webservice"] },
      { title: "Custom Domain", price: "Domain + ₹2,000", features: ["Setup", "Transfer", "Maintenance"] },
      { title: "Website Redesign", price: "50% Off", features: ["UI/UX", "Redesign", "Improvement"] },
      { title: "SEO Package", price: "₹15,000 - ₹25,000", features: ["Keywords", "On-page", "Reports"] },
    ],
    Maintenance: [
      { title: "Website Maintenance", price: "₹3,000 - ₹10,000", features: ["Updates", "Security", "Support"] },
    ],
  };

  const testimonials = [
    { name: "Amit Sharma", text: "Incredible service! My website doubled its traffic in weeks.", rating: 5 },
    { name: "Priya Patel", text: "The design is stunning and the support is top-notch.", rating: 5 },
    { name: "Rakesh Mehta", text: "Affordable and highly professional team.", rating: 4 },
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
              Crafting premium web experiences with cutting-edge technology.
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
            Tailored <span className="text-violet-600 dark:text-violet-400">Pricing Plans</span>
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
              Get a Stunning Website for Only <span className="text-4xl font-bold">₹1,999</span>!
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
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Code, ArrowRight, CheckCircle, Clock, Users, Trophy, Moon, Sun } from "lucide-react";
// import Navbar from "./Navbar";

// export default function HomePage() {
//   const [remainingSpots, setRemainingSpots] = useState(7);
//   const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 10 });
//   const [theme, setTheme] = useState("light");
//   const [isOfferVisible, setIsOfferVisible] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   // Theme setup and detection
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
//     setTheme(savedTheme);
//   }, []);

//   // Apply theme class
//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", theme === "dark");
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   // Toggle theme
//   const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

//   // Timer countdown
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev.days === 0 && prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
//           clearInterval(timer);
//           return prev;
//         }
//         let { days, hours, minutes, seconds } = prev;
//         seconds--;
//         if (seconds < 0) {
//           seconds = 59;
//           minutes--;
//           if (minutes < 0) {
//             minutes = 59;
//             hours--;
//             if (hours < 0) {
//               hours = 23;
//               days--;
//             }
//           }
//         }
//         return { days, hours, minutes, seconds };
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Show offer popup after 2 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => setIsOfferVisible(true), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   // Inject custom CSS styles
//   useEffect(() => {
//     const styleSheet = document.createElement("style");
//     styleSheet.textContent = `
//       .marquee {
//         white-space: nowrap;
//         overflow: hidden;
//         position: relative;
//       }
//       .marquee-content {
//         display: inline-block;
//         animation: marquee 12s linear infinite;
//       }
//       @keyframes marquee {
//         0% { transform: translateX(100%); }
//         100% { transform: translateX(-100%); }
//       }
//       .offer-pulse {
//         animation: offerPulse 1.5s ease-in-out infinite;
//       }
//       @keyframes offerPulse {
//         0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.8); }
//         70% { box-shadow: 0 0 0 15px rgba(139, 92, 246, 0); }
//         100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
//       }
//       .premium-text {
//         background: linear-gradient(90deg, #4f46e5, #8b5cf6, #ec4899);
//         background-size: 200% auto;
//         -webkit-background-clip: text;
//         -webkit-text-fill-color: transparent;
//         animation: gradient 2.5s ease infinite;
//       }
//       @keyframes gradient {
//         0% { background-position: 0% 50%; }
//         50% { background-position: 100% 50%; }
//         100% { background-position: 0% 50%; }
//       }
//       .floating {
//         animation: floating 2.5s ease-in-out infinite;
//       }
//       @keyframes floating {
//         0% { transform: translateY(0px); }
//         50% { transform: translateY(-12px); }
//         100% { transform: translateY(0px); }
//       }
//       .glow {
//         animation: glow 1.8s ease-in-out infinite alternate;
//       }
//       @keyframes glow {
//         from { box-shadow: 0 0 8px -8px rgba(139, 92, 246, 0.6); }
//         to { box-shadow: 0 0 25px 8px rgba(139, 92, 246, 0.6); }
//       }
//       .shimmer {
//         background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
//         background-size: 200% 100%;
//         animation: shimmer 1.5s infinite;
//       }
//       @keyframes shimmer {
//         0% { background-position: -200% 0; }
//         100% { background-position: 200% 0; }
//       }
//       .bounce {
//         animation: bounce 2s ease-in-out infinite;
//       }
//       @keyframes bounce {
//         0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
//         40% { transform: translateY(-15px); }
//         60% { transform: translateY(-8px); }
//       }
//       .scale-hover:hover {
//         transform: scale(1.05);
//         transition: transform 0.3s ease;
//       }
//     `;
//     document.head.appendChild(styleSheet);
//     return () => document.head.removeChild(styleSheet);
//   }, []);

//   // Services data
//   const services = [
//     {
//       title: "Web Development",
//       description: "Stunning, high-performance websites tailored to your brand.",
//       icon: <Code className="text-indigo-500 dark:text-indigo-300" />,
//     },
//     {
//       title: "Mobile Apps",
//       description: "Seamless, user-friendly apps for iOS and Android.",
//       icon: <Code className="text-purple-500 dark:text-purple-300" />,
//     },
//     {
//       title: "UI/UX Design",
//       description: "Intuitive designs that captivate and convert.",
//       icon: <Code className="text-pink-500 dark:text-pink-300" />,
//     },
//   ];

//   // Form state
//   const [formData, setFormData] = useState({ name: "", email: "", company: "" });
//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const form = new FormData(e.target);
//     form.append("access_key", "87c6a13e-cb0a-4053-991b-c8c151167bff");

//     try {
//       const response = await fetch("https://api.web3forms.com/submit", {
//         method: "POST",
//         body: form,
//       });

//       if (response.ok) {
//         setIsSubmitted(true);
//         setFormData({ name: "", email: "", company: "" });
//         setTimeout(() => setIsSubmitted(false), 2500);
//       } else {
//         console.error("Form submission failed:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Form submission error:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
//       {/* Theme Toggle Button */}
//       <motion.button
//         onClick={toggleTheme}
//         className="fixed right-4 top-4 z-50 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 shadow-lg hover:scale-110 transition-all duration-300 backdrop-blur-md glow"
//         aria-label="Toggle theme"
//         whileHover={{ rotate: 360 }}
//         transition={{ duration: 0.5 }}
//       >
//         {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
//       </motion.button>

//       {/* Special Offer Popup */}
//       <AnimatePresence>
//         {isOfferVisible && (
//           <motion.div
//             initial={{ opacity: 0, y: 100 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 100 }}
//             transition={{ type: "spring", stiffness: 100, damping: 15 }}
//             className="fixed bottom-6 left-6 right-6 z-50 mx-auto max-w-sm sm:max-w-md"
//           >
//             <div className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-700 dark:to-violet-700 rounded-2xl p-5 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between glow scale-hover">
//               <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//                 <Clock size={24} className="text-white animate-pulse" />
//                 <div>
//                   <p className="font-bold text-base">Exclusive Offer!</p>
//                   <p className="text-sm font-medium">Premium Website for ₹1,999</p>
//                 </div>
//               </div>
//               <div className="flex space-x-3">
//                 <motion.button
//                   onClick={() => document.getElementById("claim-offer").scrollIntoView({ behavior: "smooth" })}
//                   className="bg-white text-indigo-600 dark:text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-all duration-300"
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   Claim Now
//                 </motion.button>
//                 <motion.button
//                   onClick={() => setIsOfferVisible(false)}
//                   className="bg-white/20 px-3 py-2 rounded-lg text-sm hover:bg-white/30 transition-all duration-300"
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   ✕
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <Navbar theme={theme} toggleTheme={toggleTheme} />

//       {/* Breaking News Banner */}
//       <motion.div
//         initial={{ y: -100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 dark:from-indigo-800 dark:via-violet-800 dark:to-indigo-800 text-white pt-16 w-full overflow-hidden shadow-xl"
//       >
//         <div className="marquee py-3 relative">
//           <div className="absolute inset-0 shimmer" />
//           <div className="marquee-content text-base sm:text-lg font-semibold tracking-wide">
//             🔥 PREMIUM WEB DEVELOPMENT: Professional Website for ₹1,999! 🔥 FLASH SALE: 90% OFF! 🔥 ONLY {remainingSpots} SPOTS LEFT! 🔥
//           </div>
//         </div>
//       </motion.div>

//       {/* Hero Section */}
//       <section className="relative py-16 md:py-24 overflow-hidden">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1 }}
//             className="text-center max-w-4xl mx-auto"
//           >
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="inline-block mb-8 py-2 px-4 bg-indigo-100/90 dark:bg-indigo-900/70 rounded-full backdrop-blur-md scale-hover"
//             >
//               <span className="text-base font-semibold text-indigo-600 dark:text-indigo-300 whitespace-nowrap">
//                 Premium Web Development ⚡ ₹1,999 Only
//               </span>
//             </motion.div>
//             <motion.h1
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white"
//             >
//               <span className="premium-text">Transforming Ideas</span> into{" "}
//               <span className="premium-text">Digital Excellence</span>
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.6 }}
//               className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto"
//             >
//               Elevate your business with cutting-edge websites and apps designed to captivate and convert. Limited-time offer—act now!
//             </motion.p>
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.8 }}
//               className="mt-10 flex flex-wrap gap-4 justify-center"
//             >
//               <motion.a
//                 href="#claim-offer"
//                 className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-2 group offer-pulse scale-hover"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 Get Started
//                 <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-2" />
//               </motion.a>
//               <motion.a
//                 href="#services"
//                 className="px-8 py-4 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 font-semibold rounded-full shadow-lg hover:shadow-xl backdrop-blur-md transition-all duration-300 border border-gray-100 dark:border-gray-700 scale-hover"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 Our Services
//               </motion.a>
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 1 }}
//               className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8"
//             >
//               {[
//                 { icon: <Trophy size={28} className="text-indigo-600 dark:text-indigo-400" />, value: "99%", label: "Client Satisfaction" },
//                 { icon: <Code size={28} className="text-violet-600 dark:text-violet-400" />, value: "10+", label: "Projects Delivered" },
//                 { icon: <Users size={28} className="text-purple-600 dark:text-purple-400" />, value: "2+ Years", label: "Industry Experience" },
//               ].map((stat, index) => (
//                 <motion.div
//                   key={index}
//                   className="flex flex-col items-center"
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
//                 >
//                   <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100/80 dark:bg-indigo-900/60 mb-4 shadow-md bounce">
//                     {stat.icon}
//                   </div>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Limited Time Offer */}
//       <section className="py-16 sm:py-20 bg-indigo-600 dark:bg-indigo-800 relative overflow-hidden">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <div className="flex flex-col lg:flex-row gap-8">
//             <motion.div
//               initial={{ opacity: 0, x: -30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//               viewport={{ once: true }}
//               className="lg:w-2/3 bg-white/10 backdrop-blur-lg rounded-3xl p-8 sm:p-10 border border-white/20 scale-hover"
//             >
//               <motion.div
//                 className="flex items-center mb-6"
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//               >
//                 <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight premium-text">
//                   Premium Website Package: ₹1,999
//                 </h2>
//               </motion.div>
//               <motion.p
//                 className="text-indigo-100 text-base sm:text-lg mb-8 leading-relaxed"
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.3 }}
//               >
//                 Get a professional, high-performance website at an unbeatable price. Only 20 spots available—secure yours now!
//               </motion.p>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
//                 {[
//                   "Custom Design",
//                   "Mobile Responsive",
//                   "SEO Optimization",
//                   "1 Year Support",
//                   "Domain Setup",
//                   "SSL Certificate",
//                   "Performance Optimization",
//                   "Social Media Integration",
//                 ].map((feature, index) => (
//                   <motion.div
//                     key={index}
//                     className="flex items-center"
//                     initial={{ opacity: 0, x: -20 }}
//                     whileInView={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
//                     viewport={{ once: true }}
//                   >
//                     <CheckCircle size={24} className="text-green-300 mr-3" />
//                     <span className="text-white text-base font-medium">{feature}</span>
//                   </motion.div>
//                 ))}
//               </div>
//               <motion.a
//                 href="#claim-offer"
//                 className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 dark:bg-gray-900 dark:text-indigo-300 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 scale-hover"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 Claim Offer
//                 <ArrowRight size={20} className="ml-3" />
//               </motion.a>
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, x: 30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//               viewport={{ once: true }}
//               className="lg:w-1/3 bg-white/10 backdrop-blur-lg rounded-3xl p-8 sm:p-10 flex flex-col justify-center border border-white/20 scale-hover"
//             >
//               <div className="text-center mb-8">
//                 <motion.div
//                   className="text-white text-base font-semibold mb-3"
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   Limited Spots
//                 </motion.div>
//                 <motion.div
//                   className="text-4xl font-extrabold text-white mb-3 floating"
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5, delay: 0.2 }}
//                 >
//                   {remainingSpots} <span className="text-indigo-200 text-2xl">/ 20</span>
//                 </motion.div>
//                 <motion.div
//                   className="w-full bg-white/30 h-4 rounded-full mt-4 overflow-hidden"
//                   initial={{ opacity: 0 }}
//                   whileInView={{ opacity: 1 }}
//                   transition={{ duration: 0.5, delay: 0.4 }}
//                 >
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: `${(remainingSpots / 20) * 100}%` }}
//                     transition={{ duration: 1.2, ease: "easeOut" }}
//                     className="bg-gradient-to-r from-white to-indigo-300 dark:from-white dark:to-indigo-400 h-4 rounded-full"
//                   />
//                 </motion.div>
//               </div>
//               <div>
//                 <motion.div
//                   className="text-white text-base font-semibold mb-6 flex items-center justify-center"
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <Clock size={20} className="mr-2 animate-pulse" />
//                   Offer Ends In:
//                 </motion.div>
//                 <div className="flex justify-center space-x-4 sm:space-x-6">
//                   {["days", "hours", "minutes", "seconds"].map((unit, index) => (
//                     <motion.div
//                       key={index}
//                       className="text-center"
//                       initial={{ opacity: 0, scale: 0.8 }}
//                       whileInView={{ opacity: 1, scale: 1 }}
//                       transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
//                     >
//                       <div className="bg-white/20 rounded-xl p-3 w-14 sm:w-16 border border-white/20 glow">
//                         <div className="text-xl sm:text-2xl font-bold text-white">{timeLeft[unit]}</div>
//                       </div>
//                       <div className="text-sm text-indigo-100 mt-2 capitalize">{unit}</div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//           {/* Claim Offer Form */}
//           <motion.div
//             id="claim-offer"
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="mt-8 bg-white/10 backdrop-blur-lg rounded-3xl p-8 sm:p-10 border border-white/20"
//           >
//             <motion.h3
//               className="text-2xl sm:text-3xl font-extrabold text-white mb-8 text-center premium-text"
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               Claim Your Offer Now
//             </motion.h3>
//             <AnimatePresence>
//               {isSubmitted ? (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   transition={{ duration: 0.5 }}
//                   className="bg-green-500/20 border border-green-500/30 rounded-2xl p-8 text-center glow"
//                 >
//                   <CheckCircle size={56} className="mx-auto mb-6 text-green-400 bounce" />
//                   <h4 className="text-2xl font-bold text-white mb-3">Thank You!</h4>
//                   <p className="text-green-100 text-lg">Your request has been submitted. We'll contact you shortly!</p>
//                 </motion.div>
//               ) : (
//                 <motion.form
//                   onSubmit={handleSubmit}
//                   className="space-y-6 max-w-lg mx-auto"
//                   initial={{ opacity: 0 }}
//                   whileInView={{ opacity: 1 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <div>
//                     <label htmlFor="name" className="block text-sm font-medium text-indigo-100 mb-2">
//                       Full Name
//                     </label>
//                     <motion.input
//                       type="text"
//                       id="name"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       required
//                       className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 scale-hover"
//                       placeholder="Your Name"
//                       whileFocus={{ scale: 1.02 }}
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-indigo-100 mb-2">
//                       Email Address
//                     </label>
//                     <motion.input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       required
//                       className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 scale-hover"
//                       placeholder="Your Email"
//                       whileFocus={{ scale: 1.02 }}
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="company" className="block text-sm font-medium text-indigo-100 mb-2">
//                       Company Name
//                     </label>
//                     <motion.input
//                       type="text"
//                       id="company"
//                       name="company"
//                       value={formData.company}
//                       onChange={handleInputChange}
//                       className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 scale-hover"
//                       placeholder="Your Company"
//                       whileFocus={{ scale: 1.02 }}
//                     />
//                   </div>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     type="submit"
//                     className="w-full px-8 py-4 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 hover:from-indigo-400 hover:via-violet-400 hover:to-indigo-400 text-white text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 glow"
//                   >
//                     Submit Claim
//                   </motion.button>
//                 </motion.form>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section id="services" className="py-16 sm:py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <motion.div
//             className="text-center mb-12"
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//           >
//             <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
//               Our <span className="premium-text">Services</span>
//             </h2>
//             <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed mt-4">
//               Comprehensive digital solutions to propel your business forward.
//             </p>
//           </motion.div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {services.map((service, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: index * 0.2 }}
//                 viewport={{ once: true }}
//                 whileHover={{ y: -8, boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.15)" }}
//                 className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 p-8 group scale-hover"
//               >
//                 <motion.div
//                   className="w-14 h-14 flex items-center justify-center rounded-xl bg-indigo-100/80 dark:bg-indigo-900/60 mb-6 group-hover:scale-110 transition-transform duration-300 bounce"
//                   whileHover={{ rotate: 10 }}
//                 >
//                   {service.icon}
//                 </motion.div>
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{service.title}</h3>
//                 <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">{service.description}</p>
//                 <motion.a
//                   href={`/services#${service.title.toLowerCase().replace(" ", "-")}`}
//                   className="inline-flex items-center text-violet-600 dark:text-violet-400 text-base font-semibold hover:text-violet-700 dark:hover:text-violet-300 transition-colors duration-300 mt-6 group-hover:translate-x-2 transition-transform"
//                   whileHover={{ scale: 1.05 }}
//                 >
//                   Learn More
//                   <ArrowRight size={16} className="ml-2" />
//                 </motion.a>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }