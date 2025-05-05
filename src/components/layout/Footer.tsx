import { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('This field is required');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('This email isn\'t correct');
      return;
    }

    // Here you would typically call an API to subscribe the user
    setSubmitted(true);
    setError('');
  };

  return (
    <footer className="bg-background pt-20 pb-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-semibold mb-6">
              let's make great products together
            </h2>
            <Link
              to="/contact"
              className="btn btn-outline"
            >
              Get in touch
            </Link>
          </div>

          <div className="bg-black/20 p-8 rounded-xl flex flex-col justify-center">
            <div className="flex items-center mb-4">
              <svg width="32" height="32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="128" height="128" rx="24" fill="#1C1C23" />
                <path d="M38.4 41.6C38.4 34.4 44.2 28.8 51.2 28.8H76.8C83.8 28.8 89.6 34.4 89.6 41.6V86.4C89.6 93.6 83.8 99.2 76.8 99.2H51.2C44.2 99.2 38.4 93.6 38.4 86.4V41.6Z" fill="#30D5B7" />
                <path d="M54.4 57.6L73.6 44.8" stroke="#1C1C23" strokeWidth="6" strokeLinecap="round" />
                <path d="M54.4 70.4L73.6 83.2" stroke="#1C1C23" strokeWidth="6" strokeLinecap="round" />
                <path d="M54.4 83.2L73.6 70.4" stroke="#1C1C23" strokeWidth="6" strokeLinecap="round" />
                <path d="M54.4 44.8L73.6 57.6" stroke="#1C1C23" strokeWidth="6" strokeLinecap="round" />
              </svg>
              <span className="ml-2 text-neutral/80 font-medium">stay up to date</span>
            </div>

            <h3 className="text-xl font-medium mb-4">get our newsletter</h3>

            {submitted ? (
              <p className="text-primary">Thanks for signing up.</p>
            ) : (
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-transparent border-b border-neutral/20 pb-2 text-neutral focus:outline-none focus:border-primary"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                <button
                  type="submit"
                  className="absolute right-0 bottom-2 text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-neutral/10 pt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-neutral/80 font-medium mb-4">get in touch</h4>
            <a href="mailto:hello@bitecodes.com" className="block text-neutral hover:text-primary mb-1">hello@bitecodes.com</a>
            <a href="tel:+1234567890" className="block text-neutral hover:text-primary mb-4">+1 (234) 567-890</a>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="block text-neutral hover:text-primary">
              123 Tech Street<br />
              Silicon Valley, CA 94043
            </a>
          </div>

          <div className="space-y-2">
            <Link to="/privacy-policy" className="block text-neutral/80 hover:text-primary">Privacy policy</Link>
            <Link to="/terms-and-conditions" className="block text-neutral/80 hover:text-primary">Terms and conditions</Link>
            <p className="text-neutral/60">EIN: 98-7654321</p>
          </div>

          <div>
            <h4 className="text-neutral/80 font-medium mb-4">See what we're up to</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral/80 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-neutral/80 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral/80 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-neutral/80 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-neutral/60 text-sm">© {new Date().getFullYear()} BiteCodes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
