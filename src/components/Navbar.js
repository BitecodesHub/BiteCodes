import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-3xl text-white animate-spin">
            code
          </span>
          <a href="/">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-white drop-shadow-lg">
              BiteCodes
            </h1>
          </a>
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <motion.span
              initial={{ rotate: 0, scale: 1 }}
              animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="material-symbols-outlined text-4xl"
            >
              {isOpen ? "close" : "menu"}
            </motion.span>
          </button>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-white font-bold text-lg">
          {["Services", "About", "Projects", "Contact"].map((item) => (
            <a
              key={item}
              className="relative hover:text-slate-800 after:absolute after:left-0 after:bottom-[-3px] after:w-full after:h-[2px] after:bg-slate-800 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              href={`/${item.toLowerCase()}`}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden bg-white shadow-md overflow-hidden"
          >
            <div className="flex flex-col space-y-3 px-7 py-4">
              {["Services", "About", "Projects", "Contact"].map((item) => (
                <a
                  key={item}
                  className="text-blue-600 text-lg font-bold hover:text-purple-600 transition-colors duration-300"
                  href={`/${item.toLowerCase()}`}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
