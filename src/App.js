import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import "./css/App.css";
import { Helmet } from "react-helmet-async";


// Lazy Load Components (Ensure they have default exports)
const MainPage = lazy(() => import("./components/MainPage"));
const About = lazy(() => import("./components/About"));
const Contact = lazy(() => import("./components/Contact"));
const Services = lazy(() => import("./components/Services"));
const Projects = lazy(() => import("./components/Project")); // Ensure correct case

function App() {
  return (
    
    <>
      <Helmet>
        <title>BiteCodes - Software Experts</title>
        <meta name="description" content="BiteCodes is a leading software outsourcing company specializing in web and app development." />
      </Helmet>

      <Navbar />
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
