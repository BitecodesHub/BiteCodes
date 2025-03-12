import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";

export const MainPage = () => {
  const [activeLogoIndex, setActiveLogoIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const carouselRef = useRef(null);
  
  const clients = [
    { 
      name: "Rivala", 
      logo: "/logos/Rivala Logo Final-02.png",
      website: "https://rivalacare.com"
    },
    { 
      name: "Rivala", 
      logo: "/logos/Rivala Logo Final-02.png",
      website: "https://rivalacare.com"
    },
    { 
      name: "Rivala", 
      logo: "/logos/Rivala Logo Final-02.png",
      website: "https://rivalacare.com"
    },
    { 
      name: "Rivala", 
      logo: "/logos/Rivala Logo Final-02.png",
      website: "https://rivalacare.com"
    }
  ];

  useEffect(() => {
    let interval;
    
    if (isAutoplay) {
      interval = setInterval(() => {
        setActiveLogoIndex((prevIndex) => (prevIndex + 1) % clients.length);
      }, 3000);
    }
    
    return () => clearInterval(interval);
  }, [isAutoplay, clients.length]);

  const pauseAutoplay = () => setIsAutoplay(false);
  const resumeAutoplay = () => setIsAutoplay(true);

  const goToLogo = (index) => {
    setActiveLogoIndex(index);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 5000);
  };

  const visitClientWebsite = (event, url) => {
    event.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div id="webcrumbs">
      <Helmet>
        <title>BiteCodes - Top Software Outsourcing Company</title>
        <meta
          name="description"
          content="BiteCodes provides world-class software development solutions."
        />
        <meta
          property="og:title"
          content="BiteCodes - Software Outsourcing Experts"
        />
        <meta property="og:image" content="/seo-image.png" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <section className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-blue-800 animate-fadeIn">
              We Build Amazing Software
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-gray-700 max-w-3xl mx-auto">
              Transform your ideas into reality with our expert team.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <a href="/ai" className="relative w-full sm:w-auto">
                <button className="relative w-full sm:w-auto px-12 py-5 rounded-full text-xl font-bold text-white bg-black/90 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl shadow-blue-500/50 hover:shadow-blue-400/70 overflow-hidden group">
                  <span className="relative z-10">Try AI</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  <span className="absolute -inset-2 animate-pulse bg-blue-500/30 blur-xl rounded-full" />
                  <span className="absolute -inset-4 animate-pulse bg-cyan-400/20 blur-2xl rounded-full" />
                </button>
              </a>

              <a href="/pricelist" className="relative w-full sm:w-auto">
                <button className="relative w-full sm:w-auto px-12 py-5 rounded-full text-xl font-bold text-white overflow-hidden transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 group">
                  <span className="relative z-10">Get Pricing</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500" />
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  <span className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 blur-xl rounded-full" />
                </button>
              </a>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-10 mb-24">
            {[
              { icon: "devices", title: "Web Development", desc: "Creating responsive and dynamic websites that engage users.", color: "blue" },
              { icon: "smartphone", title: "Mobile Apps", desc: "Native and cross-platform mobile applications.", color: "purple" },
              { icon: "cloud", title: "Cloud Solutions", desc: "Scalable and secure cloud infrastructure.", color: "green" },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 text-center rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full bg-${feature.color}-100 text-${feature.color}-600 mb-6`}>
                  <span className="material-symbols-outlined text-3xl">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </section>

          <section className="bg-white rounded-3xl p-10 shadow-xl mb-24 overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-70"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-50 rounded-full blur-3xl opacity-70"></div>
            
            <div className="flex flex-col md:flex-row items-center md:space-x-12 relative z-10">
              <div className="md:w-1/2 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                  Why Choose BiteCodes?
                </h2>
                <p className="mb-8 text-lg text-gray-600">
                  We combine creativity with technical expertise to deliver outstanding results.
                </p>
                <ul className="space-y-4">
                  {[
                    "Expert Team with 10+ years experience",
                    "Modern Technologies and best practices",
                    "Agile Development methodology",
                    "Dedicated support and maintenance"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-lg text-gray-700">
                      <span className="material-symbols-outlined mr-3 text-green-500 text-2xl">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
                <div className="relative animate-bounce-slow">
                  <div className="absolute inset-0 bg-blue-100 blur-xl rounded-full opacity-70"></div>
                  <span className="material-symbols-outlined text-9xl text-blue-600 relative z-10">architecture</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="rounded-3xl p-10 shadow-xl bg-gradient-to-br from-white to-blue-50">
              <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-800">
                Trusted by Industry Leaders
              </h2>
              
              <div 
                ref={carouselRef}
                className="relative py-10 overflow-hidden"
                onMouseEnter={pauseAutoplay}
                onMouseLeave={resumeAutoplay}
              >
                <div className="flex justify-around items-center">
                  {clients.map((client, index) => (
                    <div 
                      key={index} 
                      className={`transition-all duration-700 transform px-4 flex flex-col items-center ${
                        index === activeLogoIndex 
                          ? "scale-110 opacity-100" 
                          : "scale-90 opacity-70"
                      }`}
                      onClick={() => goToLogo(index)}
                    >
                      <div 
                        className="h-40 w-60 flex items-center justify-center relative mb-5 cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={(e) => visitClientWebsite(e, client.website)}
                      >
                        <img 
                          src={client.logo === undefined ? "/api/placeholder/240/160" : client.logo} 
                          alt={`${client.name} logo`}
                          className="h-auto max-h-full w-auto max-w-full object-contain transition-all duration-500"
                        />
                        
                        {index === activeLogoIndex && (
                          <div className="absolute inset-0 rounded-full bg-blue-50 opacity-30 blur-xl -z-10 animate-pulse"></div>
                        )}
                      </div>
                      
                      <span className={`font-medium text-xl transition-all duration-500 ${
                        index === activeLogoIndex 
                          ? "text-blue-600" 
                          : "text-gray-500"
                      }`}>
                        {client.name}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between absolute top-1/2 transform -translate-y-1/2 w-full px-2 z-10">
                  <button 
                    onClick={() => goToLogo((activeLogoIndex - 1 + clients.length) % clients.length)}
                    className="bg-white/80 hover:bg-white text-blue-600 p-3 rounded-full shadow-md hover:shadow-lg transition-all"
                    aria-label="Previous client"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button 
                    onClick={() => goToLogo((activeLogoIndex + 1) % clients.length)}
                    className="bg-white/80 hover:bg-white text-blue-600 p-3 rounded-full shadow-md hover:shadow-lg transition-all"
                    aria-label="Next client"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
                
                <div className="flex justify-center mt-6 space-x-2">
                  {clients.map((_, index) => (
                    <button 
                      key={index}
                      onClick={() => goToLogo(index)}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        index === activeLogoIndex 
                          ? "bg-blue-600 w-8" 
                          : "bg-gray-300 w-3 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to client ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default MainPage;