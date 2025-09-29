// app/login/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, AlertCircle, LogIn, CheckCircle } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [apiError, setApiError] = useState<string>('');
  const [apiSuccess, setApiSuccess] = useState<string>('');
  const router = useRouter();
  const { login } = useAuth();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bitecodes.com';

  // Helper function to convert error messages to user-friendly format
  const getUserFriendlyMessage = (error: any): string => {
    // If there's a response from the server
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      // Handle specific status codes
      if (status === 401 || status === 403) {
        return 'The email or password you entered is incorrect. Please try again.';
      }
      
      if (status === 404) {
        return 'No account found with this email address. Please check your email or sign up.';
      }
      
      if (status === 429) {
        return 'Too many login attempts. Please wait a few minutes and try again.';
      }
      
      if (status === 500 || status === 502 || status === 503) {
        return 'Our server is having trouble right now. Please try again in a moment.';
      }
      
      // Check for specific error messages from backend
      const message = data?.message || data?.error || '';
      
      if (message.toLowerCase().includes('email')) {
        return 'Please enter a valid email address.';
      }
      
      if (message.toLowerCase().includes('password')) {
        return 'The password you entered is incorrect. Please try again.';
      }
      
      if (message.toLowerCase().includes('not found') || message.toLowerCase().includes('does not exist')) {
        return 'No account found with this email. Please check your email or sign up.';
      }
      
      if (message.toLowerCase().includes('invalid credentials') || message.toLowerCase().includes('incorrect')) {
        return 'The email or password you entered is incorrect. Please try again.';
      }
      
      // Return a generic user-friendly message
      return 'We couldn\'t sign you in. Please check your email and password and try again.';
    }
    
    // Network errors
    if (error.request) {
      return 'Unable to connect. Please check your internet connection and try again.';
    }
    
    // Other errors
    return 'Something went wrong. Please try again.';
  };

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setApiError('');
    setApiSuccess('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });
      
      // Check for explicit success flag
      if (response.data.success === true && response.data.token) {
        // Login successful
        login(response.data);
        setApiSuccess('Welcome back! Redirecting you now...');
        toast.success('Login successful!');
        
        // Redirect to home page
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        // Handle unexpected response format
        setApiError('We couldn\'t sign you in. Please try again.');
        toast.error('Login failed');
      }
      
    } catch (error: any) {
      const userMessage = getUserFriendlyMessage(error);
      setApiError(userMessage);
      toast.error(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setApiError('');
    setApiSuccess('');
    
    try {
      // Decode the Google JWT token to extract user details
      const decoded: any = jwtDecode(credentialResponse.credential);
      const response = await axios.post(`${API_BASE_URL}/api/auth/google-auth`, {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      });

      // Check for explicit success flag
      if (response.data.success === true && response.data.token) {
        // Google login successful
        login(response.data);
        setApiSuccess('Welcome! Redirecting you now...');
        toast.success('Successfully signed in with Google!');
        
        // Redirect to home page
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setApiError('We couldn\'t sign you in with Google. Please try again.');
        toast.error('Google sign-in failed');
      }

    } catch (error: any) {
      const userMessage = getUserFriendlyMessage(error);
      setApiError(userMessage);
      toast.error(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginFailure = () => {
    setApiError('Google sign-in was cancelled or failed. Please try again.');
    toast.error('Google sign-in failed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{apiError}</p>
              </div>
            </div>
          )}

          {/* API Success Message */}
          {apiSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-green-800">{apiSuccess}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setApiError('');
                    setErrors({...errors, email: undefined});
                  }}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:outline-none text-gray-900 ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setApiError('');
                    setErrors({...errors, password: undefined});
                  }}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:outline-none text-gray-900 ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
                useOneTap
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="300"
              />
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 py-4 px-6 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '373447199487-17q7ruiigmv5c612s0sjbdb65dmcpm5i.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
}