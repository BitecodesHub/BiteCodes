import React from "react";

export const Services = () => {
  return (
    <div id="webcrumbs">
      <div className="min-h-screen py-10 bg-gradient-to-b from-gray-900 to-gray-950">
        <main className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <section className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-100">Our Services</h2>
            <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Delivering cutting-edge solutions tailored to your business needs.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-gray-800/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gray-700/50 shadow-lg hover:shadow-xl hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105">
              <span className="material-symbols-outlined text-5xl text-gold-400">computer</span>
              <h3 className="text-xl sm:text-2xl font-bold mt-6 mb-4 text-gray-100">Web Development</h3>
              <p className="text-gray-400 leading-relaxed mb-4 text-sm sm:text-base">
                Custom websites and web applications built with modern technologies.
              </p>
              <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
                <li className="flex items-center">
                  <span className="material-symbols-outlined text-gold-400 mr-2">check_circle</span>
                  Responsive Design
                </li>
                <li className="flex items-center">
                  <span className="material-symbols-outlined text-gold-400 mr-2">check_circle</span>
                  E-commerce Solutions
                </li>
                <li className="flex items-center">
                  <span className="material-symbols-outlined text-gold-400 mr-2">check_circle</span>
                  CMS Integration
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gray-700/50 shadow-lg hover:shadow-xl hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105">
              <span className="material-symbols-outlined text-5xl text-silver-400">smartphone</span>
              <h3 className="text-xl sm:text-2xl font-bold mt-6 mb-4 text-gray-100">Mobile Development</h3>
              <p className="text-gray-400 leading-relaxed mb-4 text-sm sm:text-base">Coming Soon.</p>
              <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
                <li className="flex items-center">
                  <span className="material-symbols-outlined text-gold-400 mr-2">check_circle</span>
                  iOS Development
                </li>
                <li className="flex items-center">
                  <span className="material-symbols-outlined text-gold-400 mr-2">check_circle</span>
                  Android Development
                </li>
                <li className="flex items-center">
                  <span className="material-symbols-outlined text-gold-400 mr-2">check_circle</span>
                  React Native Apps
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gray-700/50 shadow-lg hover:shadow-xl hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105">
              <span className="material-symbols-outlined text-5xl text-gold-400">code</span>
              <h3 className="text-xl sm:text-2xl font-bold mt-6 mb-4 text-gray-100">Custom Solutions</h3>
              <p className="text-gray-400 leading-relaxed mb-4 text-sm sm:text-base">
                Tailored software solutions for your specific needs.
              </p>
              <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
                <li className="flex items-center">
                  <span className="material-symbols-outlined text-gold-400 mr-2">check_circle</span>
                  API Development
                </li>
                <li className="flex items-center">
                  <span className="material-symbols-outlined text-gold-400 mr-2">check_circle</span>
                  Database Design
                </li>
                <li className="flex items-center">
                  <span className="material-symbols-outlined text-gold-400 mr-2">check_circle</span>
                  System Integration
                </li>
              </ul>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="bg-gray-800/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gray-700/50 shadow-lg hover:shadow-xl hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105">
              <span className="material-symbols-outlined text-5xl text-silver-400">cloud</span>
              <h3 className="text-xl sm:text-2xl font-bold mt-6 mb-4 text-gray-100">Cloud Services</h3>
              <p className="text-gray-400 leading-relaxed mb-4 text-sm sm:text-base">Coming Soon.</p>
              <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
                <li className="flex items-center">
                  <span className="material-symbols-outlined text-gold-400 mr-2">check_circle</span>
                  Cloud Migration
                </li>
                <li className="flex items-center">
                  <span className="material-symbols-outlined text-gold-400 mr-2">check_circle</span>
                  AWS & Azure Solutions
                </li>
                <li className="flex items-center">
                  <span className="material-symbols-outlined text-gold-400 mr-2">check_circle</span>
                  Cloud Security
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gray-700/50 shadow-lg hover:shadow-xl hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105">
              <span className="material-symbols-outlined text-5xl text-gold-400">support</span>
              <h3 className="text-xl sm:text-2xl font-bold mt-6 mb-4 text-gray-100">Technical Support</h3>
              <p className="text-gray-400 leading-relaxed mb-4 text-sm sm:text-base">
                24/7 support and maintenance services.
              </p>
              <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
                <li className="flex items-center">
                  <span className="material-symbols-outlined text-gold-400 mr-2">check_circle</span>
                  System Maintenance
                </li>
                <li className="flex items-center">
                  <span className="material-symbols-outlined text-gold-400 mr-2">check_circle</span>
                  Performance Optimization
                </li>
                <li className="flex items-center">
                  <span className="material-symbols-outlined text-gold-400 mr-2">check_circle</span>
                  Security Updates
                </li>
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Services;