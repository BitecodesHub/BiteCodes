"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Shield, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";

const VerifyOtp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Get API URL from environment variables
  const apiUrl = process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_LIVE_API
    : process.env.NEXT_PUBLIC_LOCAL_API || "http://localhost:8080";

  useEffect(() => {
    if (!email) {
      toast.error("Email is missing. Redirecting to registration...");
      router.push("/register");
    }
  }, [email, router]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
      setMessage(""); // Clear message when user starts typing
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsVerifying(true);
    setMessage("");

    try {
      // Create request body matching backend OtpVerificationRequest
      const requestBody = {
        email: email,
        otp: otp
      };

      const response = await fetch(`${apiUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Parse the ApiResponse from backend
        const data = await response.json();
        
        if (data.success) {
          toast.success(data.message || "Email verified successfully!");
          setMessage("Verification successful! Redirecting to login...");
          
          // Redirect to login after a short delay
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          setMessage(data.message || "Verification failed. Please try again.");
          toast.error(data.message || "Verification failed. Please try again.");
        }
      } else {
        // Handle error response
        try {
          const errorData = await response.json();
          const errorMessage = errorData.message || "Verification failed. Please try again.";
          setMessage(errorMessage);
          toast.error(errorMessage);
        } catch {
          // If response is not JSON, fall back to text
          const errorText = await response.text();
          const errorMessage = errorText || "Verification failed. Please try again.";
          setMessage(errorMessage);
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      let errorMessage = "Network error. Please check your connection and try again.";
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = "Unable to connect to the server. Please check if the server is running.";
      }
      
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setResendMessage("Email is missing.");
      return;
    }

    setIsResending(true);
    setResendMessage("");

    try {
      const response = await fetch(`${apiUrl}/api/auth/resend-otp/${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setResendMessage("OTP sent successfully to your email.");
        toast.success("New OTP sent successfully!");
        setOtp(""); // Clear current OTP
      } else {
        const errorResponse = await response.text();
        const errorMessage = errorResponse || "Failed to resend OTP.";
        setResendMessage(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      const errorMessage = "Network error. Please try again.";
      setResendMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <Head>
        <title>Verify OTP - Bitecodes Academy</title>
        <meta name="description" content="Verify your email address with the OTP sent to your email." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
              <p className="text-gray-600 mb-4">We've sent a 6-digit code to your email</p>
              <div className="bg-indigo-50 rounded-lg p-3">
                <p className="font-medium text-indigo-600 truncate">
                  {email}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Verification Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  maxLength={6}
                  className={`block w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:outline-none text-gray-900 placeholder-gray-400 ${
                    message && !message.includes("successful")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                  required
                  disabled={isVerifying}
                />
                <p className="mt-1 text-xs text-gray-500 text-center">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isVerifying || otp.length !== 6}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
                >
                  {isVerifying ? (
                    <div className="flex items-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Verifying...
                    </div>
                  ) : (
                    "Verify Email"
                  )}
                </button>
              </div>
            </form>

            {message && (
              <div className={`flex items-start gap-2 p-3 rounded-lg border mt-4 ${
                message.includes("successful") || message.includes("Verification successful")
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}>
                <AlertCircle className="flex-shrink-0 mt-0.5" size={16} />
                <span className="text-sm">{message}</span>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm mb-3">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-indigo-600 hover:text-indigo-500 font-medium underline underline-offset-4 hover:underline-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isResending ? "Sending..." : "Resend OTP"}
              </button>
            </div>

            {resendMessage && (
              <div className={`text-center text-sm mt-3 ${
                resendMessage.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}>
                {resendMessage}
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Need help?{" "}
                <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Back to Registration
                </Link>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 py-4 px-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              Check your spam folder if you don't see the email. The code expires in 10 minutes.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOtp;