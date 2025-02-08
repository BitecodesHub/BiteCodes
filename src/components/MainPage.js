import React from "react";
import { Helmet } from "react-helmet-async";

export const MainPage = () => {
  return (
    <div id="webcrumbs">
      <Helmet>
        <title>BiteCodes - Top Software Outsourcing Company</title>
        <meta name="description" content="BiteCodes provides world-class software development solutions." />
        <meta property="og:title" content="BiteCodes - Software Outsourcing Experts" />
        <meta property="og:image" content="/seo-image.png" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <main className="max-w-7xl mx-auto px-4 py-16">
          <section className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 animate-pulse">
              We Build Amazing Software
            </h2>
            <p className="text-xl mb-8">
              Transform your ideas into reality with our expert team.
            </p>
            <a href="/services">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transform hover:scale-105 transition-transform duration-200">
                Get Started
              </button>
            </a>
          </section>

          <section className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
              <span className="material-symbols-outlined text-4xl text-blue-600">
                devices
              </span>
              <h3 className="text-xl font-bold mt-4 mb-2">Web Development</h3>
              <p>Creating responsive and dynamic websites that engage users.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
              <span className="material-symbols-outlined text-4xl text-purple-600">
                smartphone
              </span>
              <h3 className="text-xl font-bold mt-4 mb-2">Mobile Apps</h3>
              <p>Native and cross-platform mobile applications.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
              <span className="material-symbols-outlined text-4xl text-green-600">
                cloud
              </span>
              <h3 className="text-xl font-bold mt-4 mb-2">Cloud Solutions</h3>
              <p>Scalable and secure cloud infrastructure.</p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-lg mb-20">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-4">
                  Why Choose BiteCodes?
                </h2>
                <p className="mb-4">
                  We combine creativity with technical expertise to deliver
                  outstanding results.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-symbols-outlined mr-2 text-green-600">
                      check_circle
                    </span>
                    Expert Team
                  </li>
                  <li className="flex items-center">
                    <span className="material-symbols-outlined mr-2 text-green-600">
                      check_circle
                    </span>
                    Modern Technologies
                  </li>
                  <li className="flex items-center">
                    <span className="material-symbols-outlined mr-2 text-green-600">
                      check_circle
                    </span>
                    Agile Development
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0">
                <div className="relative animate-float">
                  <span className="material-symbols-outlined text-9xl text-blue-600">
                    architecture
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-lg mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Our Success Stories
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 border border-gray-200 rounded-xl hover:border-blue-500 transition-colors duration-300">
                <span className="material-symbols-outlined text-5xl text-blue-600">
                  rocket_launch
                </span>
                <h3 className="text-xl font-bold mt-4 mb-2">
                  2 Projects Delivered
                </h3>
                <p>Crafting digital experiences with expertise.</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-xl hover:border-purple-500 transition-colors duration-300">
                <span className="material-symbols-outlined text-5xl text-purple-600">
                  groups
                </span>
                <h3 className="text-xl font-bold mt-4 mb-2">2 Happy Clients</h3>
                <p>Building long-term relationships with trust.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
export default MainPage;