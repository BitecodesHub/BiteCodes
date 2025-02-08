import { faFacebookF, faLinkedin, faSquareGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
export const Footer = () => {
  return (
        <footer className="bg-gray-900 text-white py-7">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">BiteCodes</h3>
                <p className="text-gray-400">
                  Transforming ideas into powerful digital solutions.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/services"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/projects"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Projects
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center justify-center">
                    <span className="material-symbols-outlined mr-2">
                      location_on
                    </span>
                   Ahmedabad
                  </li>
                  <li className="flex items-center justify-center">
                    <span className="material-symbols-outlined mr-2">mail</span>
                    bitecodes.global@gmail.com
                  </li>
                  <li className="flex items-center justify-center">
                    <span className="material-symbols-outlined mr-2">
                      phone
                    </span>
                    +91 79906-72067
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                <div className="flex justify-center space-x-4">
                  <a
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                  <a
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faXTwitter} />
                  </a>
                  <a
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                  <a
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faSquareGithub} />
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>© 2025 BiteCodes. All rights reserved.</p>
            </div>
          </div>
      </footer>
    );
}
