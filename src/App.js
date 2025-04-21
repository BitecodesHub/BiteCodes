import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import "./css/App.css";
import { Helmet } from "react-helmet-async";
import AppDevelopmentPage from "./components/AppDevelopmentPage";
import APIDevelopmentPage from "./components/APIDevelopmentPage";

// Lazy Load Components (Ensure they have default exports)
const MainPage = lazy(() => import("./components/MainPage"));
const About = lazy(() => import("./components/About"));
const Contact = lazy(() => import("./components/Contact"));
const Services = lazy(() => import("./components/Services"));
const Projects = lazy(() => import("./components/Project")); // Ensure correct case
const PriceList = lazy(() => import("./components/PriceList")); // Ensure correct case
const ArtificialIntelligence = lazy(() => import("./components/ai")); // Ensure correct case
const WebDevelopmentPage = lazy(() => import("./components/WebDevelopmentPage"));


function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoaded(true), 500); // Simulate loading delay
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Helmet>
        <title>BiteCodes - Software Experts</title>
        <meta name="description" content="BiteCodes is a leading software company specializing in web and app development." />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Navbar />

        {/* Ensure content area takes space and prevents footer shifting */}
        <main className="flex-grow">
          <Suspense
            fallback={
              <div className="loading min-h-[60vh] flex items-center justify-center text-white text-lg">
                Loading...
              </div>
            }
            onReady={() => setIsLoaded(true)}
          >
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/ai" element={<ArtificialIntelligence />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/pricelist" element={<PriceList />} />
              <Route path="/web-development" element={<WebDevelopmentPage />} />
              <Route path="/app-development" element={<AppDevelopmentPage />} />
              <Route path="/api-development" element={<APIDevelopmentPage />} />
            </Routes>
          </Suspense>
        </main>

        {/* Hide footer until page has loaded */}
        {isLoaded && <Footer />}
      </div>
    </>
  );
}

export default App;
