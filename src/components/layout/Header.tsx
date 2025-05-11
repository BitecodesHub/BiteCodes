import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      // Check if event target is an Element before using closest()
      const target = event.target as Element;
      
      if (mobileMenuOpen && target && !target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };

    // Add event listener
    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside);
      
      // Cleanup function to remove event listener
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    
    return undefined;
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    // Toggle menu state
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-5 px-4 md:px-8 bg-primary/3">
      <div className="container flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/" className="inline-block" onClick={handleLinkClick}>
          <div className="flex items-center">
            <svg width="36" height="36" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <rect width="128" height="128" rx="24" fill="#1C1C23" />
              <path d="M38.4 41.6C38.4 34.4 44.2 28.8 51.2 28.8H76.8C83.8 28.8 89.6 34.4 89.6 41.6V86.4C89.6 93.6 83.8 99.2 76.8 99.2H51.2C44.2 99.2 38.4 93.6 38.4 86.4V41.6Z" fill="#30D5B7" />
              <path d="M54.4 57.6L73.6 44.8" stroke="#1C1C23" strokeWidth="6" strokeLinecap="round" />
              <path d="M54.4 70.4L73.6 83.2" stroke="#1C1C23" strokeWidth="6" strokeLinecap="round" />
              <path d="M54.4 83.2L73.6 70.4" stroke="#1C1C23" strokeWidth="6" strokeLinecap="round" />
              <path d="M54.4 44.8L73.6 57.6" stroke="#1C1C23" strokeWidth="6" strokeLinecap="round" />
            </svg>
            <span className="text-2xl font-medium tracking-wide text-neutral">
              Bitecodes
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          <Link to="/products" className="text-neutral/80 hover:text-primary transition-colors text-sm uppercase tracking-widest">
            P r o d u c t s
          </Link>
          <Link to="/solutions" className="text-neutral/80 hover:text-primary transition-colors text-sm uppercase tracking-widest">
            S o l u t i o n s
          </Link>
          <Link to="/contact" className="text-neutral/80 hover:text-primary transition-colors text-sm uppercase tracking-widest">
            C o n t a c t
          </Link>
        </nav>

        {/* Contact Button */}
        <Link
          to="/contact"
          className="hidden md:inline-flex items-center justify-center rounded-full bg-black/20 border border-neutral/10 px-6 py-2 text-sm text-neutral hover:bg-black/30 transition-colors"
        >
          Get in touch
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-neutral/80 hover:text-primary transition-colors p-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg 
            viewBox="0 0 24 24" 
            width="24" 
            height="24" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none" 
            className={`transition-all duration-300 ${mobileMenuOpen ? "scale-100" : "scale-100"}`}
          >
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        {/* Mobile Menu with animation */}
        <div 
          className={`md:hidden absolute top-16 left-0 right-0 bg-background border border-neutral/10 rounded-lg py-4 px-6 space-y-4 transform transition-all duration-300 ease-in-out mobile-menu-container shadow-lg ${
            mobileMenuOpen 
              ? "opacity-100 translate-y-0 scale-100 visible" 
              : "opacity-0 -translate-y-4 scale-95 invisible pointer-events-none"
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          <Link 
            to="/products" 
            className="block text-neutral/80 hover:text-primary transition-colors text-sm uppercase tracking-widest"
            onClick={handleLinkClick}
          >
            P r o d u c t s
          </Link>
          <Link 
            to="/solutions" 
            className="block text-neutral/80 hover:text-primary transition-colors text-sm uppercase tracking-widest"
            onClick={handleLinkClick}
          >
            S o l u t i o n s
          </Link>
          <Link 
            to="/contact" 
            className="block text-neutral/80 hover:text-primary transition-colors text-sm uppercase tracking-widest"
            onClick={handleLinkClick}
          >
            C o n t a c t
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full bg-black/20 border border-neutral/10 px-6 py-2 text-sm text-neutral hover:bg-black/30 transition-colors"
            onClick={handleLinkClick}
          >
            Get in touch
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;