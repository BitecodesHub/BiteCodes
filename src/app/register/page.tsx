"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  AlertCircle, 
  UserPlus,
  Loader2 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [message, setMessage] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.bitecodes.com';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Clear general message when user makes changes
    if (message) {
      setMessage("");
    }
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsChecked(e.target.checked);
    if (validationErrors.terms && e.target.checked) {
      setValidationErrors(prev => ({ ...prev, terms: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      errors.username = "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!termsChecked) {
      errors.terms = "You must agree to the Terms and Conditions";
    }

    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      setMessage(firstError);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      console.log("Attempting registration with:", {
        username: formData.username,
        email: formData.email,
      });

      // Create user object matching your backend User entity
      const userPayload = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        enabled: false // This matches your entity default
      };

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPayload),
      });

      console.log("Registration response status:", response.status);

      // Handle the response text since your backend returns plain text
      const responseText = await response.text();
      console.log("Registration response text:", responseText);

      if (response.ok) {
        console.log("Registration successful:", responseText);
        
        toast.success(responseText || "Registration successful! Please check your email for verification code.");
        
        // Redirect to OTP verification with email as query parameter
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      } else {
        // Handle error response (your backend returns error messages as plain text)
        console.error("Registration failed:", responseText);
        
        let errorMessage = responseText;
        
        // Handle specific error cases
        if (responseText.includes("Email or Username Already Exist")) {
          errorMessage = "This email or username is already registered. Please use a different one or try logging in.";
        } else if (response.status === 400) {
          errorMessage = responseText || "Invalid registration data. Please check your inputs.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = responseText || `Registration failed (${response.status})`;
        }
        
        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Network error. Please check your connection and try again.";
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = "Unable to connect to the server. Please check if the server is running.";
      }
      
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsSubmitting(true);
    setMessage("");
    
    try {
      // Decode the Google JWT token to extract user details
      const decoded: any = jwtDecode(credentialResponse.credential!);
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/google-auth`, {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      });

      // Check for explicit success flag
      if (response.data.success === true && response.data.token) {
        // Google login successful
        login(response.data);
        setMessage('Welcome! Redirecting you now...');
        toast.success('Successfully signed in with Google!');
        
        // Redirect to home page
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setMessage('We couldn\'t sign you in with Google. Please try again.');
        toast.error('Google sign-in failed');
      }

    } catch (error: any) {
      console.error("Google authentication error:", error);
      
      let errorMessage = 'Google authentication failed. Please try again.';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401 || status === 403) {
          errorMessage = 'Unable to authenticate with Google. Please try again.';
        } else if (status === 500 || status === 502 || status === 503) {
          errorMessage = 'Server error. Please try again later.';
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect. Please check your internet connection.';
      }
      
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setMessage('Google sign-in was cancelled or failed. Please try again.');
    toast.error('Google sign-in failed');
  };

  const getInputClassName = (fieldName: keyof ValidationErrors) => {
    const baseClass = "block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:outline-none text-gray-900 placeholder-gray-500";
    const errorClass = "border-red-500 focus:ring-red-500";
    const normalClass = "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500";
    
    return `${baseClass} ${validationErrors[fieldName] ? errorClass : normalClass}`;
  };

  const getPasswordInputClassName = (fieldName: keyof ValidationErrors) => {
    const baseClass = "block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:outline-none text-gray-900 placeholder-gray-500";
    const errorClass = "border-red-500 focus:ring-red-500";
    const normalClass = "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500";
    
    return `${baseClass} ${validationErrors[fieldName] ? errorClass : normalClass}`;
  };

  return (
    <>
      <Head>
        <title>Register - Bitecodes Academy</title>
        <meta name="description" content="Join Bitecodes Academy and start your learning journey. Create your account today." />
      </Head>

      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "373447199487-17q7ruiigmv5c612s0sjbdb65dmcpm5i.apps.googleusercontent.com"}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Bitecodes Academy</h1>
                <p className="text-gray-600">Create your account to start learning</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      className={getInputClassName("username")}
                      placeholder="Enter your username"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  {validationErrors.username && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.username}
                    </p>
                  )}
                </div>

                {/* Email Field */}
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
                      value={formData.email}
                      onChange={handleChange}
                      className={getInputClassName("email")}
                      placeholder="Enter your email"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
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
                      value={formData.password}
                      onChange={handleChange}
                      className={getPasswordInputClassName("password")}
                      placeholder="Enter your password"
                      required
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={getPasswordInputClassName("confirmPassword")}
                      placeholder="Confirm your password"
                      required
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isSubmitting}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsChecked}
                    onChange={handleTermsChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{" "}
                    <a href="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {validationErrors.terms && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.terms}
                  </p>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>

                {/* Error/Success Message */}
                {message && (
                  <div className={`flex items-start gap-2 p-3 rounded-lg border ${
                    message.includes("successful") || message.includes("Welcome")
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}>
                    <AlertCircle className="flex-shrink-0 mt-0.5" size={16} />
                    <span className="text-sm">{message}</span>
                  </div>
                )}
              </form>

              {/* Divider */}
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
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    theme="filled_blue"
                    size="large"
                    text="signup_with"
                    shape="rectangular"
                    width="300"
                  />
                </div>
              </div>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 py-4 px-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                By creating an account, you agree to our{" "}
                <a href="/terms" className="text-indigo-600 hover:text-indigo-500">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
};

export default Register;