import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Code, Menu, X, ChevronDown } from "lucide-react";

const NavbarItem = ({ href, label, hasDropdown = false, dropdownItems = [] }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  return (
    <div className="relative group">
      <a
        href={href}
        className="flex items-center gap-1 font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 dark:hover:bg-black/20"
        onClick={hasDropdown ? (e) => {
          e.preventDefault();
          setIsDropdownOpen(!isDropdownOpen);
        } : undefined}
      >
        {label}
        {hasDropdown && (
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} 
          />
        )}
      </a>
      
      {hasDropdown && (
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-1 w-48 rounded-lg overflow-hidden backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 shadow-lg border border-white/20 dark:border-gray-800/50 z-50"
            >
              {dropdownItems.map((item, idx) => (
                <a 
                  key={idx}
                  href={item.href}
                  className="block px-4 py-2 text-gray-200 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export const Navbar = () =>{
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Check user preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
    
    // Apply theme class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Handle scroll events
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const navItems = [
    { href: "/services", label: "Services", hasDropdown: true, dropdownItems: [
      { href: "/web-development", label: "Web Development" },
      { href: "/app-development", label: "App Development" },
      { href: "/api-development", label: "API Development" }
    ]},
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <div className={`fixed w-full top-0 z-50 transition-all duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <nav className={`${
        scrolled 
          ? "bg-white/80 dark:bg-gray-900/80 shadow-lg" 
          : "bg-white/40 dark:bg-gray-900/40"
        } backdrop-blur-md transition-all duration-500`}>
        <div className="max-w-7xl mx-auto px-4 md:px-2 sm:px-6 lg:px-4 py-3">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg"
              >
                <Code size={24} className="text-white" />
              </motion.div>
              <a href="/" className="group">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-500">
                  BiteCodes
                </h1>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, idx) => (
                <NavbarItem 
                  key={idx} 
                  href={item.href} 
                  label={item.label} 
                  hasDropdown={item.hasDropdown} 
                  dropdownItems={item.dropdownItems} 
                />
              ))}
            </div>

            {/* Theme Toggle & Mobile Menu Button */}
            <div className="flex items-center space-x-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/50 transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isDarkMode ? "dark" : "light"}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDarkMode ? (
                      <Sun size={20} className="text-yellow-300" />
                    ) : (
                      <Moon size={20} className="text-blue-800" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              <div className="md:hidden">
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  {isOpen ? (
                    <X size={24} className="text-gray-200 dark:text-gray-200" />
                  ) : (
                    <Menu size={24} className="text-gray-200 dark:text-gray-200" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-t border-gray-200 dark:border-gray-800"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item, idx) => (
                  <div key={idx}>
                    <a
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                    {item.hasDropdown && (
                      <div className="pl-5 space-y-1 mt-1">
                        {item.dropdownItems.map((subItem, subIdx) => (
                          <a
                            key={subIdx}
                            href={subItem.href}
                            className="block px-3 py-1 rounded-md text-sm font-medium text-gray-200 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-colors duration-200"
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};
export default Navbar;