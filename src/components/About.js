import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Code, CheckCircle, Clock, ArrowRight, Moon, Sun } from "lucide-react";
import { faFacebookF, faInstagram, faLinkedin, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "./Navbar";

export default function AboutPage() {
  const [theme, setTheme] = useState("light");

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

  // Team members data
  const team = [
    {
      name: "Karan Jaswani",
      role: "Founder & CEO",
      image: "/api/placeholder/150/150",
      social: { linkedin: "https://www.linkedin.com/in/karan-jaswani", twitter: "/" },
    },
    {
      name: "Ismail Mansuri",
      role: "Founder & CTO",
      image: "/api/placeholder/150/150",
      social: { linkedin: "https://www.linkedin.com/in/bite-codes/", twitter: "/" },
    },
    {
      name: "Hamza Shaikh",
      role: "UI/UX Designer",
      image: "/api/placeholder/150/150",
      social: { linkedin: "https://www.linkedin.com/in/bite-codes/", twitter: "/" },
    },
  ];

  // Company values data
  const values = [
    {
      title: "Innovation",
      description: "Pushing boundaries with cutting-edge solutions",
      icon: <Code className="text-indigo-500 dark:text-indigo-400" />,
    },
    {
      title: "Collaboration",
      description: "Working together to achieve greatness",
      icon: <Users className="text-violet-500 dark:text-violet-400" />,
    },
    {
      title: "Excellence",
      description: "Delivering unmatched quality in every product",
      icon: <CheckCircle className="text-green-500 dark:text-green-400" />,
    },
    {
      title: "Integrity",
      description: "Building trust through transparency and honesty",
      icon: <Clock className="text-pink-500 dark:text-pink-400" />,
    },
  ];

  // Animation variants for letter stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  // Split headline into letters
  const headline = "About BiteCodes";
  const headlineLetters = headline.split("");

  return (
    <div className="min-h-screen py-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed right-4 bottom-4 z-50 p-3 rounded-full bg-indigo-100 dark:bg-gray-800 text-gray-200 dark:text-gray-200 shadow-lg hover:scale-110 transition-all duration-300"
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className="relative py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                {headlineLetters.map((letter, index) => (
                  <motion.span key={index} variants={letterVariants}>
                    {letter}
                  </motion.span>
                ))}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              Transforming ideas into innovative digital solutions since 2015.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
              Our <span className="text-violet-600 dark:text-violet-400">Story</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              From a small startup to a leader in digital innovation, our journey is driven by passion and excellence.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-indigo-200 dark:bg-indigo-700 h-full"></div>
            {[
              {
                year: "2023",
                title: "Founded BiteCodes",
                description: "Started with a vision to revolutionize digital solutions in Ahmedabad.",
              },
              {
                year: "2024",
                title: "First Major Product",
                description: "Launched our first major platform, serving thousands of users.",
              },
              {
                year: "2024",
                title: "Global Reach",
                description: "Expanded our services to clients across three continents.",
              },
              {
                year: "2025",
                title: "Industry Leader",
                description: "Recognized as a top provider of innovative software products.",
              },
            ].map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex items-center mb-12 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className="w-1/2 px-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{milestone.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{milestone.description}</p>
                </div>
                <div className="w-1/2 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 dark:bg-indigo-400 text-white flex items-center justify-center font-bold">
                    {milestone.year}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
              Our <span className="text-indigo-600 dark:text-indigo-400">Mission</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              At BiteCodes, we empower businesses and individuals by creating innovative, user-centric digital products that drive success and inspire change.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
              Meet Our <span className="text-violet-600 dark:text-violet-400">Team</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              A talented group of innovators driving our mission forward.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mt-6 object-cover"
                />
                <h3 className="text-xl font-bold mt-4 text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
                <div className="flex justify-center gap-4 mt-4 mb-6">
                  <motion.a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FontAwesomeIcon icon={faLinkedin} size="lg" />
                  </motion.a>
                  <motion.a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FontAwesomeIcon icon={faXTwitter} size="lg" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
              Our <span className="text-indigo-600 dark:text-indigo-400">Values</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              The principles that guide everything we do at BiteCodes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-indigo-100/30 dark:bg-indigo-900/20 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-900 dark:to-violet-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Ready to Collaborate?
            </h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Let’s work together to create innovative solutions that drive your success. Contact us today!
            </p>
            <motion.a
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 dark:bg-gray-900 dark:text-indigo-400 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get in Touch
              <ArrowRight size={20} className="ml-2" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}