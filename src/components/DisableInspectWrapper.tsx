"use client";

import { useEffect, useState } from "react";

export default function DisableInspectWrapper({ children }: { children: React.ReactNode }) {
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  useEffect(() => {
    // 🚫 Disable right-click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    // 🚫 Block common devtool shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U")
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 🚨 Detect if DevTools is open
    const checkDevTools = () => {
      const threshold = 160; // px difference
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        setDevToolsOpen(true);
      } else {
        setDevToolsOpen(false);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", checkDevTools);

    // Run initial check
    checkDevTools();

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", checkDevTools);
    };
  }, []);

  return (
    <>
      {children}

      {devToolsOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "linear-gradient(135deg, #1e3c72, #2a5298)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🕵️‍♂️🤫</div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
           👀 Caught you red-handed!
          </h1>
          <p style={{ fontSize: "1.2rem", maxWidth: "500px" }}>
            This page contains <strong>confidential secrets</strong> 🔐.  
            Please don’t try to sneak in with Developer Tools — we see you 👀.
          </p>
          <p style={{ fontSize: "1rem", marginTop: "1rem", opacity: 0.8 }}>
            Close DevTools to continue your adventure 🚀✨
          </p>
        </div>
      )}
    </>
  );
}
