import React from "react";


export const About = () => {
  return (
    <div id="webcrumbs">
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <main className="max-w-7xl mx-auto px-4 py-16 pb-1">
          <section className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">About BiteCodes</h2>
            <p className="text-xl mb-12 max-w-3xl mx-auto">
              We are a passionate team of developers, designers, and innovators
              dedicated to creating exceptional digital experiences.
            </p>
          </section>
          <section className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="bg-white p-8 text-center rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <span className="material-symbols-outlined text-5xl text-blue-600">
                history_edu
              </span>
              <h3 className="text-2xl font-bold mt-6 mb-4">Our Story</h3>
              <p className="text-gray-600 leading-relaxed">
                Founded in 2025, We believe in pushing boundaries and creating
                solutions that make a difference.
              </p>
            </div>

            <div className="bg-white p-8 text-center rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <span className="material-symbols-outlined text-5xl text-purple-600">
                lightbulb
              </span>
              <h3 className="text-2xl font-bold mt-6 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To empower businesses through innovative technology solutions
                and create lasting impact in the digital world.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-12 shadow-lg mb-20">
            <h3 className="text-3xl font-bold mb-8 text-center">Our Values</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-2 text-center items-center hover:bg-blue-50 rounded-xl transition-colors duration-300">
                <span className="material-symbols-outlined text-4xl text-blue-600">
                  verified
                </span>
                <h4 className="text-xl font-bold mt-4 mb-2">Excellence</h4>
                <p className="text-gray-600">
                  Striving for the highest quality in everything we do.
                </p>
              </div>

              <div className="p-2 text-center hover:bg-blue-50 rounded-xl transition-colors duration-300">
                <span className="material-symbols-outlined text-4xl text-green-600">
                  psychology
                </span>
                <h4 className="text-xl font-bold mt-4 mb-2">Innovation</h4>
                <p className="text-gray-600">
                  Embracing new ideas and creative solutions.
                </p>
              </div>

              <div className="p-2 text-center hover:bg-blue-50 rounded-xl transition-colors duration-300">
                <span className="material-symbols-outlined text-4xl text-purple-600">
                  diversity_3
                </span>
                <h4 className="text-xl font-bold mt-4 mb-2">Collaboration</h4>
                <p className="text-gray-600">
                  Working together to achieve shared success.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-12 shadow-lg mb-20">
            <h3 className="text-3xl font-bold mb-8 text-center">Our Team</h3>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="p-6 text-center bg-gradient-to-b from-blue-50 to-white rounded-xl hover:shadow-lg transition-all duration-300">
                <span className="material-symbols-outlined text-6xl text-blue-600">
                  engineering
                </span>
                <h4 className="text-lg font-bold mt-4 mb-2">
                  Software Engineers
                </h4>
                <p className="text-gray-600">2+ Engineers</p>
              </div>

              <div className="p-6 text-center bg-gradient-to-b from-purple-50 to-white rounded-xl hover:shadow-lg transition-all duration-300">
                <span className="material-symbols-outlined text-6xl text-purple-600">
                  brush
                </span>
                <h4 className="text-lg font-bold mt-4 mb-2">UI/UX Designers</h4>
                <p className="text-gray-600">0 Creatives</p>
              </div>

              <div className="p-6 text-center bg-gradient-to-b from-green-50 to-white rounded-xl hover:shadow-lg transition-all duration-300">
                <span className="material-symbols-outlined text-6xl text-green-600">
                  analytics
                </span>
                <h4 className="text-lg font-bold mt-4 mb-2">
                  Project Managers
                </h4>
                <p className="text-gray-600">2 Leaders</p>
              </div>

              <div className="p-6 text-center bg-gradient-to-b from-orange-50 to-white rounded-xl hover:shadow-lg transition-all duration-300">
                <span className="material-symbols-outlined text-6xl text-orange-600">
                  support_agent
                </span>
                <h4 className="text-lg font-bold mt-4 mb-2">Support Team</h4>
                <p className="text-gray-600">2+ Professionals</p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <h3 className="text-3xl font-bold mb-20 text-center">
              Our Founders
            </h3>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-r from-purple-100 to-purple-200 mb-6">
                    <span className="material-symbols-outlined text-8xl text-purple-600 flex items-center justify-center h-full">
                      person
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Ismail Mansuri</h4>
                  <p className="text-gray-600 mb-4">Founder & CEO</p>
                  <p className="text-gray-600 text-center leading-relaxed">
                    6+ Months of Experience in Software Development and Team
                    Leadership.
                  </p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-blue-200 mb-6">
                    <span className="material-symbols-outlined text-8xl text-blue-600 flex items-center justify-center h-full">
                      person
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Karan Jaswani</h4>
                  <p className="text-gray-600 mb-4">Co-founder & CTO</p>
                  <p className="text-gray-600 text-center leading-relaxed">
                    6+ Months of Experience in Software Development and Team
                    Leadership.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Story and Mission sections - remain the same */}
          {/* <section className="grid md:grid-cols-2 gap-12 mb-20"> */}
          {/* ... Same story and mission code ... */}
          {/* </section> */}

          {/* Values section - remains the same */}
          {/* <section className="bg-white rounded-2xl p-12 shadow-lg mb-20"> */}
          {/* ... Same values code ... */}
          {/* </section> */}

          {/* Extended Team section with departments */}
          {/* <section className="bg-white rounded-2xl p-6 md:p-10 shadow-lg mb-16">
            <h3 className="text-3xl font-bold mb-10 md:mb-20 text-center">
              Our Departments
            </h3>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
            
              <div className="p-10 sm:p-6 bg-gradient-to-b from-blue-50 to-white rounded-xl hover:shadow-lg transition-all duration-300">
                <h4 className="text-2xl font-bold mb-6 text-center md:text-left">
                  Development Team
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <span className="material-symbols-outlined text-blue-600 mr-3">
                      engineering
                    </span>
                    <div>
                      <p className="font-semibold">
                        Frontend Development (2 members)
                      </p>
                      <p className="text-gray-600">
                        Specialized in React and Tailwind
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="material-symbols-outlined text-blue-600 mr-3">
                      database
                    </span>
                    <div>
                      <p className="font-semibold">
                        Backend Development (2 members)
                      </p>
                      <p className="text-gray-600">
                        Expert in Java, MySQL & Rest-APIs
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="material-symbols-outlined text-blue-600 mr-3">
                      phone_iphone
                    </span>
                    <div>
                      <p className="font-semibold">
                        Mobile Development (2 members)
                      </p>
                      <p className="text-gray-600">
                        iOS and Android Development
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-10 sm:p-6 bg-gradient-to-b from-purple-50 to-white rounded-xl hover:shadow-lg transition-all duration-300">
                <h4 className="text-2xl font-bold mb-6 text-center md:text-left">
                  Design Team
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <span className="material-symbols-outlined text-purple-600 mr-3">
                      brush
                    </span>
                    <div>
                      <p className="font-semibold">UI Designers (2 members)</p>
                      <p className="text-gray-600">
                        Interface and visual design experts
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="material-symbols-outlined text-purple-600 mr-3">
                      psychology
                    </span>
                    <div>
                      <p className="font-semibold">
                        UX Researchers (2 members)
                      </p>
                      <p className="text-gray-600">
                        User research and testing specialists
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="material-symbols-outlined text-purple-600 mr-3">
                      motion_photos_on
                    </span>
                    <div>
                      <p className="font-semibold">
                        Motion Designers (0 members)
                      </p>
                      <p className="text-gray-600">
                        Animation and interaction experts
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-10 sm:p-6 bg-gradient-to-b from-green-50 to-white rounded-xl hover:shadow-lg transition-all duration-300">
                <h4 className="text-2xl font-bold mb-6 text-center md:text-left">
                  Project Management
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <span className="material-symbols-outlined text-green-600 mr-3">
                      analytics
                    </span>
                    <div>
                      <p className="font-semibold">
                        Project Managers (2 members)
                      </p>
                      <p className="text-gray-600">PMP Professionals</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="material-symbols-outlined text-green-600 mr-3">
                      calendar_month
                    </span>
                    <div>
                      <p className="font-semibold">Scrum Masters (2 members)</p>
                      <p className="text-gray-600">Remote Scrum Experts</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-10 sm:p-6 bg-gradient-to-b from-orange-50 to-white rounded-xl hover:shadow-lg transition-all duration-300">
                <h4 className="text-2xl font-bold mb-6 text-center md:text-left">
                  Support Team
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <span className="material-symbols-outlined text-orange-600 mr-3">
                      support_agent
                    </span>
                    <div>
                      <p className="font-semibold">
                        Technical Support (2 members)
                      </p>
                      <p className="text-gray-600">
                        10+ hrs/day Customer Assistance
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="material-symbols-outlined text-orange-600 mr-3">
                      school
                    </span>
                    <div>
                      <p className="font-semibold">Training Team (0 members)</p>
                      <p className="text-gray-600">
                        Product Education Specialists
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="material-symbols-outlined text-orange-600 mr-3">
                      verified_user
                    </span>
                    <div>
                      <p className="font-semibold">
                        Quality Assurance (2 members)
                      </p>
                      <p className="text-gray-600">
                        Testing and quality control
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section> */}
        </main>
      </div>
    </div>
  );
};
export default About;