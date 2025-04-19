import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code, ArrowRight, Moon, Sun } from "lucide-react";
import Navbar from "./Navbar";

export default function ProjectsPage() {
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

  // Project data
  const projects = [
    {
      title: "E-Learning Platform",
      description: "Interactive educational platform with real-time collaboration.",
      link: "https://www.elearning.bitecodes.com",
      icon: <Code className="text-white" size={48} />,
      gradient: "from-purple-500 to-purple-700",
      tech: ["React", "Java", "MySQL"],
      status: "Live",
    },
    {
      title: "Billing & Invoice Application",
      description: "A powerful web app for effortless billing, invoicing, and stock management.",
      link: "https://voistock.bitecodes.com",
      icon: <Code className="text-white" size={48} />,
      gradient: "from-pink-500 to-pink-700",
      tech: ["React", "Spring Boot", "PostgreSQL"],
      status: "Live",
    },
    {
      title: "Linked Paws (Pet Social Media)",
      description: "Social media platform connecting pet lovers with adoption services, veterinary clinics, and pet care resources.",
      link: "https://www.pet.bitecodes.com",
      icon: <Code className="text-white" size={48} />,
      gradient: "from-green-500 to-green-700",
      tech: ["React Native", "Firebase", "GraphQL"],
      status: "Live",
    },
    {
      title: "Healthcare Platform",
      description: "A comprehensive platform for healthcare services, currently under development.",
      link: "#",
      icon: <Code className="text-white" size={48} />,
      gradient: "from-blue-500 to-blue-700",
      tech: ["React", "Spring Boot", "MongoDB"],
      status: "In Progress",
    },
    {
      title: "Property Rental Platform",
      description: "A platform for seamless property rentals, currently under development.",
      link: "#",
      icon: <Code className="text-white" size={48} />,
      gradient: "from-orange-500 to-orange-700",
      tech: ["React", "Spring Boot", "AWS"],
      status: "In Progress",
    },
    {
      title: "HR Management Platform",
      description: "An advanced HR management solution, currently under development.",
      link: "#",
      icon: <Code className="text-white" size={48} />,
      gradient: "from-indigo-500 to-indigo-700",
      tech: ["TypeScript", "Java", "Docker"],
      status: "In Progress",
    },
  ];

  // Tech tag colors
  const techColors = {
    React: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
    Java: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400",
    MySQL: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
    "Spring Boot": "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
    PostgreSQL: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
    "React Native": "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
    Firebase: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400",
    GraphQL: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400",
    MongoDB: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
    AWS: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400",
    TypeScript: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
    Docker: "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400",
  };

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
  const headline = "Our Products";
  const headlineLetters = headline.split("");

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
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className={`h-48 bg-gradient-to-r ${project.gradient} flex items-center justify-center relative`}>
                  {project.icon}
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === "Live"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${techColors[tech]}`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                  <motion.span
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    {project.status === "Live" ? "View Product" : "Coming Soon"}
                    <ArrowRight size={16} className="ml-2" />
                  </motion.span>
                </div>
              </motion.a>
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
              Ready to Build Your Next Product?
            </h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Let’s collaborate to create innovative solutions tailored to your needs. Contact us today to get started!
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