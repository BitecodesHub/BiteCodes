"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Highly defensive DevTools detection + sensitive-data purge wrapper.
 *
 * Usage:
 *  - Wrap your app with <DisableInspectWrapper>...children...</DisableInspectWrapper>
 *  - Wherever you hold sensitive React state, register a cleanup callback:
 *      window.__SECURE?.registerSensitive(() => { setToken(null); ... })
 *
 * Caveats:
 *  - Client-side only defensive layer. Always secure data on server.
 */

declare global {
  interface Window {
    __SECURE?: {
      registerSensitive: (fn: () => void) => string;
      unregisterSensitive: (id: string) => void;
      clearAllSensitive: () => void;
      abortAllRequests: () => void;
    };
    __SECURE_ABORT_MAP?: Map<string, AbortController>;
  }
}

export default function DisableInspectWrapper({ children }: { children: React.ReactNode }) {
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const detectionRef = useRef({
    lastTrigger: 0,
    throttleMs: 800,
  });
  const originalsRef = useRef({
    fetch: window.fetch.bind(window),
    XHR: window.XMLHttpRequest,
    WebSocket: (window as any).WebSocket,
    consoleLog: console.log.bind(console),
    consoleWarn: console.warn.bind(console),
    consoleError: console.error.bind(console),
  });

  // A tiny in-memory registry for abort controllers and sensitive cleanup callbacks
  if (!window.__SECURE) {
    window.__SECURE = {
      registerSensitive: (fn: () => void) => {
        const id = Math.random().toString(36).slice(2);
        (window.__SECURE as any)[`_s_${id}`] = fn;
        return id;
      },
      unregisterSensitive: (id: string) => {
        delete (window.__SECURE as any)[`_s_${id}`];
      },
      clearAllSensitive: () => {
        for (const k in window.__SECURE) {
          if (k.startsWith("_s_")) {
            try {
              (window.__SECURE as any)[k]();
            } catch (e) {
              // swallow
            }
            delete (window.__SECURE as any)[k];
          }
        }
      },
      abortAllRequests: () => {
        const map = window.__SECURE_ABORT_MAP;
        if (map) {
          for (const [, ctrl] of map) {
            try {
              ctrl.abort();
            } catch {}
          }
          map.clear();
        }
      },
    };
  }

  // Ensure abort map exists
  if (!window.__SECURE_ABORT_MAP) window.__SECURE_ABORT_MAP = new Map();

  // Utility: clear cookies aggressively (path/domain variations)
  const clearAllCookies = () => {
    try {
      if (!document?.cookie) return;
      const cookies = document.cookie.split(";");
      const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      for (const c of cookies) {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        // Try common domain variations (best-effort)
        const hostParts = location.hostname.split(".");
        const domains = hostParts.reduce<string[]>((acc, _, idx) => {
          const domain = "." + hostParts.slice(idx).join(".");
          acc.push(domain);
          return acc;
        }, []);
        // set cookie for many domains
        try {
          document.cookie = `${name}=; ${expire}`;
        } catch {}
        for (const d of domains) {
          try {
            document.cookie = `${name}=; ${expire}; domain=${d}`;
          } catch {}
        }
      }
    } catch (err) {
      // ignore
    }
  };

  // Utility: clear storage + caches + indexedDB
  const clearStoragesAndCaches = async () => {
    try {
      sessionStorage?.clear();
    } catch {}
    try {
      localStorage?.clear();
    } catch {}
    try {
      // caches (CacheStorage)
      if (window.caches && typeof window.caches.keys === "function") {
        const keys = await caches.keys();
        for (const key of keys) {
          try {
            await caches.delete(key);
          } catch {}
        }
      }
    } catch {}
    try {
      // Service Worker unregister
      if (navigator?.serviceWorker?.getRegistrations) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const r of regs) {
          try {
            await r.unregister();
          } catch {}
        }
      }
    } catch {}
    try {
      // IndexedDB: best-effort deletion
      // databases() is experimental; use fallback to known names if necessary
      const idb = (window as any).indexedDB;
      if (idb) {
        if (typeof idb.databases === "function") {
          const dbs: any[] = await idb.databases();
          for (const db of dbs) {
            try {
              if (db && db.name) idb.deleteDatabase(db.name);
            } catch {}
          }
        } else {
          // fallback — try common names if known (can't enumerate)
        }
      }
    } catch {}
    clearAllCookies();
  };

  // Heuristic: scrub window variables that look sensitive
  const scrubGlobals = () => {
    try {
      const suspicious = ["token", "secret", "password", "auth", "credentials", "access"];
      for (const k in window) {
        try {
          if (!Object.prototype.hasOwnProperty.call(window, k)) continue;
          const val = (window as any)[k];
          if (typeof val === "string") {
            const kl = k.toLowerCase();
            if (suspicious.some((s) => kl.includes(s) || val.toLowerCase().includes(s))) {
              (window as any)[k] = null;
            }
          } else if (typeof val === "object" && val !== null) {
            // if object has obvious secret props, null it
            try {
              const keys = Object.keys(val);
              if (keys.some((kk) => suspicious.some((s) => kk.toLowerCase().includes(s)))) {
                (window as any)[k] = null;
              }
            } catch {}
          }
        } catch {}
      }
    } catch {}
  };

  // Central cleanup routine
  const wipeEverything = async () => {
    try {
      // abort fetches and xhrs
      try {
        window.__SECURE?.abortAllRequests();
      } catch {}
      // registered app-specific sensitive handlers
      try {
        window.__SECURE?.clearAllSensitive();
      } catch {}
      // clear storages/caches/IDB/cookies
      await clearStoragesAndCaches();
      // scrub globals
      scrubGlobals();
      // try to null out certain common globals used for secrets
      try {
        (window as any).APP_TOKEN = null;
        (window as any).__SECRET = null;
      } catch {}
    } catch {}
  };

  // Monkey-patch fetch / XHR / WebSocket to track or block requests
  const installNetworkInterceptors = () => {
    // patch fetch to attach AbortController to a map for later aborting
    try {
      const origFetch = originalsRef.current.fetch;
      (window as any).fetch = async function (input: any, init?: RequestInit) {
        // if blocked state active, short-circuit
        if (devToolsOpen) return Promise.reject(new Error("Blocked due to security policy"));
        const id = Math.random().toString(36).slice(2);
        const controller = new AbortController();
        window.__SECURE_ABORT_MAP?.set(id, controller);
        let mergedInit = init ?? {};
        mergedInit = { ...(mergedInit as object), signal: controller.signal };
        try {
          const res = await origFetch(input, mergedInit as RequestInit);
          return res;
        } finally {
          window.__SECURE_ABORT_MAP?.delete(id);
        }
      };
    } catch (err) {
      // swallow
    }

    // patch XHR to attach to map
    try {
      const OrigXHR: any = originalsRef.current.XHR;
      function PatchedXHR(this: any) {
        const xhr = new OrigXHR();
        const id = Math.random().toString(36).slice(2);
        const controller = new AbortController();
        window.__SECURE_ABORT_MAP?.set(id, controller);
        // override open/send to attach abort behavior
        const origOpen = xhr.open;
        xhr.open = function (...args: any[]) {
          try {
            // when send is called, link abort to xhr.abort
            const origSend = xhr.send;
            xhr.send = function (...sargs: any[]) {
              try {
                // if controller aborted, abort xhr
                const onAbort = () => {
                  try {
                    xhr.abort();
                  } catch {}
                };
                if ((controller as any).signal) {
                  (controller as any).signal.addEventListener?.("abort", onAbort);
                }
                return origSend.apply(xhr, sargs);
              } catch (e) {
                return origSend.apply(xhr, sargs);
              }
            };
          } catch {}
          return origOpen.apply(xhr, args);
        };
        // cleanup on loadend
        xhr.addEventListener?.("loadend", () => {
          window.__SECURE_ABORT_MAP?.delete(id);
        });
        return xhr;
      }
      // keep prototype chain
      PatchedXHR.prototype = OrigXHR.prototype;
      window.XMLHttpRequest = PatchedXHR as any;
    } catch (err) {
      // swallow
    }

    // patch WebSocket: block new connections while triggered
    try {
      const OrigWS = originalsRef.current.WebSocket;
      (window as any).WebSocket = function (url: string, protocols?: string | string[]) {
        if (devToolsOpen) throw new Error("Blocked due to security policy");
        // @ts-ignore
        return new OrigWS(url, protocols);
      };
    } catch {}
  };

  // restore network primitives
  const restoreNetworkInterceptors = () => {
    try {
      window.fetch = originalsRef.current.fetch;
    } catch {}
    try {
      window.XMLHttpRequest = originalsRef.current.XHR;
    } catch {}
    try {
      (window as any).WebSocket = originalsRef.current.WebSocket;
    } catch {}
  };

  // Multiple detection heuristics
  const detectDevTools = () => {
    try {
      const now = Date.now();
      if (now - detectionRef.current.lastTrigger < detectionRef.current.throttleMs) return;
      detectionRef.current.lastTrigger = now;

      // 1) Resize heuristic (common trick)
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        triggerDetection();
        return;
      }

      // 2) Debugger/time check (very small timing measurement)
      let start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      let delta = performance.now() - start;
      // If delta is unexpectedly large, devtools may have paused
      if (delta > 100) {
        triggerDetection();
        return;
      }

      // 3) Console open detection via toString trick
      const element = new Image();
      Object.defineProperty(element, "id", {
        get: function () {
          // property accessed when console.log prints the element in some browsers when console open
          triggerDetection();
          return "";
        },
      });
      // some consoles will access properties when logging
      console.log("%c", element);

      // 4) Overwritten console methods check
      if (typeof (console as any).firebug !== "undefined") {
        triggerDetection();
        return;
      }

      // 5) Visibility / focus heuristics: devtools often cause blur/visibilitychange
      // handled separately via event listeners

    } catch (err) {
      // ignore
    }
  };

  // Central trigger handler
  const triggerDetection = async () => {
    // set state, install blocking patches, and run wipe
    try {
      if (!devToolsOpen) setDevToolsOpen(true);
      installNetworkInterceptors();
      await wipeEverything();
      // Optionally: override fetch to reject (extra safety)
      try {
        window.fetch = () => Promise.reject(new Error("Blocked due to security policy"));
      } catch {}
      // replace XHR/WS already done in installNetworkInterceptors
    } catch {}
  };

  // When devtools closes, restore some things (best-effort)
  const onDevToolsClose = () => {
    try {
      setDevToolsOpen(false);
      restoreNetworkInterceptors();
      // we keep storages cleared (we don't restore user secrets!)
    } catch {}
  };

  useEffect(() => {
    // set up listeners
    const handleResize = () => detectDevTools();
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U")
      ) {
        e.preventDefault();
        e.stopPropagation();
        detectDevTools();
      }
    };

    const handleVisibility = () => {
      // if user switches tab and comes back quickly with devtools open, check
      detectDevTools();
    };

    const handleBlur = () => {
      // Might indicate devtools or other focus stealers
      setTimeout(() => {
        detectDevTools();
      }, 150);
    };

    // Hook console methods to detect inspection in some consoles
    const hookConsole = () => {
      try {
        console.log = function (...args: any[]) {
          originalsRef.current.consoleLog(...args);
          // no-op
        };
        console.warn = function (...args: any[]) {
          originalsRef.current.consoleWarn(...args);
        };
        console.error = function (...args: any[]) {
          originalsRef.current.consoleError(...args);
        };
      } catch {}
    };

    hookConsole();

    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", handleKey, true);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);

    // initial setup
    installNetworkInterceptors();
    detectDevTools();

    // Monitor devtools close by polling heuristics (best-effort)
    const closePoll = setInterval(() => {
      // if heuristics don't indicate devtools we assume closed
      try {
        const threshold = 160;
        const isOpen =
          window.outerWidth - window.innerWidth > threshold ||
          window.outerHeight - window.innerHeight > threshold;
        if (!isOpen && devToolsOpen) {
          onDevToolsClose();
        } else if (isOpen && !devToolsOpen) {
          triggerDetection();
        }
      } catch {}
    }, 1000);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleKey, true);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      clearInterval(closePoll);
      // restore network primitives
      restoreNetworkInterceptors();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // When devToolsOpen toggles, ensure UI blocking and maybe side-effects
  useEffect(() => {
    // If user closed DevTools and we restored, nothing else — note storages cleared remain cleared.
  }, [devToolsOpen]);

  // UI shown when devtools is detected
  return (
    <>
      {children}
      {devToolsOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(30,60,114,0.95), rgba(42,82,152,0.95))",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999999,
            textAlign: "center",
            padding: "2rem",
            backdropFilter: "blur(4px)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🕵️‍♀️🔒</div>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
            Security lock: inspection detected
          </h1>
          <p style={{ fontSize: "1.05rem", maxWidth: "640px", lineHeight: 1.4 }}>
            Developer tools or debugger were detected. For your safety, sensitive data has been
            cleared and network access has been disabled. Please close developer tools and reload to
            continue.
          </p>
          <div style={{ marginTop: "1.25rem", opacity: 0.9 }}>
            <button
              onClick={() => {
                // final attempt: run full wipe and reload
                ;(async () => {
                  await wipeEverything();
                  try {
                    location.reload();
                  } catch {}
                })();
              }}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: 8,
                border: "none",
                background: "white",
                color: "#16325c",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Clear & Reload
            </button>
          </div>
        </div>
      )}
    </>
  );
}
