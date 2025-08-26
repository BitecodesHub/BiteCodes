// components/Header.tsx
"use client";
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, BookOpen, University, FileText, Target, User, LogIn, LogOut, Settings, Bell, CreditCard, HelpCircle, ChevronDown } from 'lucide-react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '@/app/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  
  // Use auth context
  const { user, isLoggedIn, login, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      // Decode the Google JWT token to extract user details
      const decoded: any = jwtDecode(credentialResponse.credential)
      const response = await axios.post(`${API_BASE_URL}/api/auth/google-auth`, {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      })

      // On Google login success:
      if (response.data.success) {
        const { token, username, email, profileurl, userid, name, role } = response.data;

        // Use the auth context login function
        login({ userid, username, email, profileurl, name, role }, token);
        setIsUserDropdownOpen(false);

        toast.success('Google login successful!');
      } else {
        toast.error(response.data.message || 'Google login failed');
      }

    } catch (error) {
      toast.error('Google login failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleGoogleLoginFailure = () => {
    toast.error('Google login failed. Please try again.')
  }

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    toast.success('Logged out successfully');
  }

  const navigation = [
    {
      name: 'Entrance Exams',
      href: '/entrance-exams',
      icon: BookOpen,
      description: 'CMAT, NFAT, DAIICT & more'
    },
    {
      name: 'Universities',
      href: '/universities',
      icon: University,
      description: 'DAU, NFSU, NIRMA & more'
    },
    {
      name: 'Preparation',
      href: '/docs',
      icon: FileText,
      description: 'Study materials & guides'
    },
    {
      name: 'Mock Tests',
      href: '/mock-tests',
      icon: Target,
      description: 'Free practice tests'
    },
  ]

  const userMenuItems = [
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'Mock Attempts', href: '/mock-attempts', icon: BookOpen },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'Help Center', href: '/help', icon: HelpCircle },
  ]

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">
                  Bitecodes Academy
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group relative flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-3">
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {/* User Profile / Login */}
              <div className="relative" ref={dropdownRef}>
                {isLoggedIn && user ? (
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <img
                      src={user.profileurl || 'https://webcrumbs.cloud/placeholder'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-200 transition-all duration-200"
                    />
                    <span className="hidden md:inline font-medium text-gray-700">{user.name}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isUserDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700"
                  >
                    <LogIn className="w-5 h-5" />
                    <span className="hidden md:inline font-medium">Login</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isUserDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>
                )}

                {/* Enhanced User Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    {isLoggedIn && user ? (
                      <>
                        {/* User Info Section */}
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img
                                src={user.profileurl || 'https://webcrumbs.cloud/placeholder'}
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                              />
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                              <p className="text-xs text-gray-600 truncate">{user.email}</p>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                {user.role}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          {userMenuItems.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150 group"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <item.icon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                              <span>{item.name}</span>
                            </Link>
                          ))}
                        </div>

                        {/* Logout Button */}
                        <div className="border-t border-gray-100 py-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Login Section */}
                        <div className="p-4 border-b border-gray-100">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">Welcome to Bitecodes Academy</h3>
                          <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onError={handleGoogleLoginFailure}
                            width="240"
                            theme="outline"
                            size="medium"
                          />
                        </div>

                        {/* Alternative Login Options */}
                        <div className="py-2">
                          <Link
                            href="/login"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150 group"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <LogIn className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                            <span>Login with Email</span>
                          </Link>
                          <Link
                            href="/register"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150 group"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <User className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                            <span>Create Account</span>
                          </Link>
                        </div>

                        {/* Help Section */}
                        <div className="border-t border-gray-100 py-2">
                          <Link
                            href="/help"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150 group"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <HelpCircle className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                            <span>Help Center</span>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                ))}

                {/* Mobile Auth Links */}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  {isLoggedIn && user ? (
                    <>
                      <div className="px-3 py-2 bg-gray-50 rounded-lg mx-2 mb-2">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.profileurl || 'https://webcrumbs.cloud/placeholder'}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                            <p className="text-xs text-gray-600 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <item.icon className="w-5 h-5" />
                          <div>{item.name}</div>
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <div>Sign Out</div>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-2 mb-2">
                        <GoogleLogin
                          onSuccess={handleGoogleLoginSuccess}
                          onError={handleGoogleLoginFailure}
                          width="280"
                          theme="outline"
                          size="medium"
                        />
                      </div>
                      <Link
                        href="/login"
                        className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LogIn className="w-5 h-5" />
                        <div>Login with Email</div>
                      </Link>
                      <Link
                        href="/register"
                        className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <div>Create Account</div>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </GoogleOAuthProvider>
  )
}