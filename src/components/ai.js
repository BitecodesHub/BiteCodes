import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AI = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isStopped, setIsStopped] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const controllerRef = useRef(null);
  const chatHistoryRef = useRef([]);

  useEffect(() => {
    const welcomeMessage = "👋 Hi there! I'm BiteCode AI. How can I help with your coding today?";
    setTimeout(() => {
      appendMessage(welcomeMessage, "ai-message");
    }, 500);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages, loading]);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const appendMessage = (text, className) => {
    chatHistoryRef.current.push({ text, className, id: Date.now() });
    setChatMessages([...chatHistoryRef.current.slice(-50)]);
  };

  const generate = async () => {
    if (!message.trim()) return;
    
    setIsStopped(false);
    setMessage("");
    setLoading(true);
    appendMessage(message, "user-message");
    appendMessage("", "ai-message");
    
    controllerRef.current = new AbortController();
    
    try {
      const response = await fetch("https://ai.bitecodes.com/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "stable-code:3b", prompt: message, stream: true }),
        signal: controllerRef.current.signal,
      });
    
      if (!response.ok) throw new Error("Error fetching response");
    
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let tempText = "";
    
      while (true) {
        const { done, value } = await reader.read();
        if (done || isStopped) break;
    
        const chunk = decoder.decode(value, { stream: true });
        chunk.split("\n").forEach((line) => {
          if (line.startsWith("data:")) {
            try {
              const json = JSON.parse(line.replace("data: ", "").trim());
              if (json.response) {
                tempText += json.response;
              }
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        });
    
        setChatMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1].text = tempText;
          return updatedMessages;
        });
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted by user.");
      } else {
        console.error(error);
        appendMessage("⚠️ Oops! Something went wrong while generating the response. Please try again.", "ai-message");
      }
    } finally {
      setLoading(false);
      controllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    setIsStopped(true);
    controllerRef.current?.abort();
    setLoading(false);
  };

  const handleInputChange = (event) => setMessage(event.target.value);

  const toggleGenerate = () => {
    if (loading) stopGeneration();
    else generate();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className={`min-h-screen flex justify-center items-center p-5 transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`w-full max-w-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-xl p-6 relative`}>
        <header className="flex justify-between items-center mb-6">
          <motion.h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">BiteCode AI</motion.h1>
          <motion.button onClick={toggleTheme} className={`p-3 rounded-full ${isDarkMode ? "bg-gray-700 text-amber-300" : "bg-gray-200 text-blue-600"}`}>
            {isDarkMode ? "🌙" : "☀️"}
          </motion.button>
        </header>

        <div ref={chatContainerRef} className={`h-[500px] overflow-y-auto p-4 rounded-xl mb-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
          <AnimatePresence>
            {chatMessages.map((msg) => (
              <motion.div key={msg.id} className={msg.className === "user-message" ? "text-right" : "text-left"}>
                <div className={`inline-block max-w-[85%] p-4 rounded-2xl shadow-lg ${msg.className === "user-message" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>{msg.text}</div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && <span className="text-gray-400">BiteCode is thinking...</span>}
        </div>

        <div className="flex gap-4">
          <motion.input type="text" value={message} onChange={handleInputChange} className="flex-1 p-4 rounded-xl border" placeholder="Ask me anything about coding..." />
          <motion.button onClick={toggleGenerate} className={`p-4 rounded-xl font-semibold shadow-lg ${loading ? "bg-red-500" : "bg-blue-600 text-white"}`}>
            {loading ? "⏹︎ Stop" : "🚀 Send"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AI;