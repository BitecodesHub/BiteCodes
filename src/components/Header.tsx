"use client";
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { 
  Menu, X, BookOpen, Users, University, FileText, Target, 
  User, LogIn, LogOut, Settings, Bell, CreditCard, HelpCircle, 
  ChevronDown, Crown, Star, MessageCircle, Bookmark, Search,
  Heart, TrendingUp
} from 'lucide-react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '@/app/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  
  // Use auth context
  const { user, isLoggedIn, login, logout, isPremiumUser } = useAuth();

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!isLoggedIn) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/api/notifications/unread-count`, {
          
        });
        setUnreadCount(response.data.unreadCount || 0);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, API_BASE_URL]);

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

      console.log("🔍 Header Google login response:", response.data);

      // On Google login success:
      if (response.data.success) {
        // Pass entire response to include premiumStatus
        login(response.data);
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
      name: 'Community',
      href: '/feed',
      icon: Users,
      description: 'Join discussions & connect'
    },
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
      name: 'Mock Tests',
      href: '/mock-tests',
      icon: Target,
      description: 'Free practice tests'
    },
    {
      name: 'Search',
      href: '/search',
      icon: Search,
      description: 'Find posts and discussions'
    },
  ]

  const userMenuItems = [
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    { name: 'Notifications', href: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Messages', href: '/chat', icon: MessageCircle },
    { name: 'Mock Attempts', href: '/mock-attempts', icon: BookOpen },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'Help Center', href: '/help', icon: HelpCircle },
  ]

  const quickActions = [
    { name: 'Create Post', href: '/create-post', icon: TrendingUp, description: 'Share your thoughts' },
    { name: 'Explore Posts', href: '/feed', icon: Users, description: 'Discover community content' },
  ]

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
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

              {/* Premium/Upgrade Button */}
              {isLoggedIn && user ? (
                isPremiumUser() ? (
                  <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-2 rounded-full border border-amber-200">
                    <Crown className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">Premium</span>
                  </div>
                ) : (
                  <Link
                    href="/premium"
                    className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium text-sm"
                  >
                    <Star className="w-4 h-4" />
                    <span>Upgrade</span>
                  </Link>
                )
              ) : null}

              {/* Notifications Bell */}
              {isLoggedIn && user && (
                <Link
                  href="/notifications"
                  className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {/* User Profile / Login */}
              <div className="relative" ref={dropdownRef}>
                {isLoggedIn && user ? (
                  <>
                    {/* User Profile Button */}
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {user.profileurl ? (
                        <img
                          src={user.profileurl}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                      <span className="hidden md:block text-sm font-medium text-gray-700">
                        {user.name?.split(' ')[0] || 'User'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {/* User Dropdown Menu */}
                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          {isPremiumUser() && (
                            <div className="mt-2 flex items-center space-x-1">
                              <Crown className="w-3 h-3 text-amber-600" />
                              <span className="text-xs text-amber-600 font-medium">Premium Member</span>
                            </div>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="py-2 border-b border-gray-100">
                          <div className="px-3 py-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                              Quick Actions
                            </p>
                            <div className="space-y-1">
                              {quickActions.map((action) => (
                                <Link
                                  key={action.name}
                                  href={action.href}
                                  className="flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                  onClick={() => setIsUserDropdownOpen(false)}
                                >
                                  <action.icon className="w-4 h-4" />
                                  <div>
                                    <div className="font-medium">{action.name}</div>
                                    <div className="text-xs text-gray-500">{action.description}</div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          {userMenuItems.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors group"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <div className="flex items-center space-x-3">
                                <item.icon className="w-4 h-4" />
                                <span>{item.name}</span>
                              </div>
                              {item.badge && item.badge > 0 && (
                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                                  {item.badge > 9 ? '9+' : item.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                          
                          {isPremiumUser() && (
                            <Link
                              href="/premium/manage"
                              className="flex items-center space-x-3 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <Crown className="w-4 h-4" />
                              <span>Manage Premium</span>
                            </Link>
                          )}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 py-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-2 w-full text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Login Button */}
                    <GoogleLogin
                      onSuccess={handleGoogleLoginSuccess}
                      onError={handleGoogleLoginFailure}
                      useOneTap
                      theme="outline"
                      size="medium"
                      text="signin_with"
                      shape="rectangular"
                    />
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden">
              <div className="pt-2 pb-3 space-y-1 border-t border-gray-200">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}

                {/* Quick Actions for Mobile */}
                {isLoggedIn && user && (
                  <>
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Quick Actions
                    </div>
                    {quickActions.map((action) => (
                      <Link
                        key={action.name}
                        href={action.href}
                        className="flex items-center space-x-3 px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <action.icon className="w-5 h-5" />
                        <span>{action.name}</span>
                      </Link>
                    ))}
                  </>
                )}
              </div>

              {/* Mobile Premium/User Section */}
              {isLoggedIn && user && (
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-3 mb-3">
                    {user.profileurl ? (
                      <img
                        src={user.profileurl}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {isPremiumUser() && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Crown className="w-3 h-3 text-amber-600" />
                          <span className="text-xs text-amber-600 font-medium">Premium Member</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isPremiumUser() && (
                    <Link
                      href="/premium"
                      className="mx-3 mb-3 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Star className="w-4 h-4" />
                      <span>Upgrade to Premium</span>
                    </Link>
                  )}

                  <div className="space-y-1">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && item.badge > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                            {item.badge > 9 ? '9+' : item.badge}
                          </span>
                        )}
                      </Link>
                    ))}

                    {isPremiumUser() && (
                      <Link
                        href="/premium/manage"
                        className="flex items-center space-x-3 px-3 py-2 text-base font-medium text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Crown className="w-5 h-5" />
                        <span>Manage Premium</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-3 py-2 w-full text-left text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </GoogleOAuthProvider>
  )
}