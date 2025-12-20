"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Heart, Sparkles, Users, BookOpen, Upload, Camera, TrendingUp, Award, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Donor {
  donorName: string;
  amount: number;
  message: string;
  photoUrl: string;
  paidAt: string;
}

interface Stats {
  totalAmount: number;
  totalDonations: number;
  totalDonors: number;
  averageDonation: number;
}

export default function DonatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentDonors, setRecentDonors] = useState<Donor[]>([]);
  const [topDonors, setTopDonors] = useState<Donor[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: "",
    message: "",
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const { user, getToken } = useAuth();

  useEffect(() => {
    setMounted(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    fetchStats();
    fetchRecentDonors();
    fetchTopDonors();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchRecentDonors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations/donors/recent?limit=6`);
      const data = await response.json();
      setRecentDonors(data);
    } catch (error) {
      console.error("Failed to fetch recent donors:", error);
    }
  };

  const fetchTopDonors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations/donors/top?limit=3`);
      const data = await response.json();
      setTopDonors(data);
    } catch (error) {
      console.error("Failed to fetch top donors:", error);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Photo size should be less than 5MB");
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDonate = async () => {
    if (!form.name || !form.email || !form.amount) {
      alert("Please fill all required fields");
      return;
    }

    if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append("amount", form.amount);
      formData.append("name", form.name);
      formData.append("email", form.email);
      if (form.message) formData.append("message", form.message);
      if (photoFile) formData.append("photo", photoFile);

      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/api/donations/create`, {
        method: "POST",
        headers: headers,
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create donation order");
      }

      const data = await res.json();

      const options = {
        key: data.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Bitecodes Academy",
        description: "Support Bitecodes Education",
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            const token = getToken();
            const verifyHeaders: Record<string, string> = {
              "Content-Type": "application/json",
            };
            if (token) {
              verifyHeaders["Authorization"] = `Bearer ${token}`;
            }

            const verifyRes = await fetch(`${API_BASE_URL}/api/donations/verify`, {
              method: "POST",
              headers: verifyHeaders,
              credentials: "include",
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error("Payment verification failed");
            }

            const verifyData = await verifyRes.json();

            alert("❤️ Thank you for your generous donation! Your support helps us keep education free for everyone.");
            
            if (verifyData.donationId) {
              const downloadReceipt = confirm("Would you like to download your receipt?");
              if (downloadReceipt) {
                window.open(`${API_BASE_URL}/api/donations/receipt/${verifyData.donationId}`, '_blank');
              }
            }
            
            setForm({ name: "", email: "", amount: "", message: "" });
            setPhotoFile(null);
            setPhotoPreview(null);
            
            fetchStats();
            fetchRecentDonors();
            fetchTopDonors();
            
            if (token) {
              setTimeout(() => router.push('/donations'), 2000);
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment successful but verification failed. Please contact support.");
          }
        },
        prefill: { name: form.name, email: form.email },
        theme: { color: "#3b82f6" },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert("Payment failed: " + response.error.description);
        setLoading(false);
      });
      
      rzp.open();
    } catch (err: any) {
      console.error("Donation error:", err);
      alert(err.message || "Donation failed. Please try again.");
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m ago`;
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const presetAmounts = [100, 500, 1000, 2000];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6 animate-pulse">
              <Heart className="text-white w-12 h-12 fill-current" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
              Support Our Mission
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help us provide quality education completely free of charge
            </p>
          </div>
        </div>

        {/* Stats Section */}
        {stats && (
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 transition-all duration-700 delay-100 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-600">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <span className="text-sm text-gray-500">Total</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
              <p className="text-sm text-gray-600 mt-1">Raised so far</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-600">
              <div className="flex items-center justify-between mb-2">
                <Heart className="w-8 h-8 text-green-600" />
                <span className="text-sm text-gray-500">Donations</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDonations}</p>
              <p className="text-sm text-gray-600 mt-1">Contributions</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-purple-600">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-purple-600" />
                <span className="text-sm text-gray-500">Donors</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDonors}</p>
              <p className="text-sm text-gray-600 mt-1">Supporters</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-orange-600">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-orange-600" />
                <span className="text-sm text-gray-500">Average</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.averageDonation)}</p>
              <p className="text-sm text-gray-600 mt-1">Per donation</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className={`lg:col-span-2 transition-all duration-700 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-blue-100">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 mb-8 border border-blue-200">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Free Education for All</h3>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      We provide quality education and resources completely free of charge. 
                      Your generous donation helps us keep our platform accessible to everyone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    {photoPreview && (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                      />
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
                        {photoPreview ? <Camera className="w-5 h-5 text-blue-600" /> : <Upload className="w-5 h-5 text-gray-400" />}
                        <span className="text-sm text-gray-600">
                          {photoPreview ? 'Change Photo' : 'Upload Your Photo'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Your photo will be displayed publicly. Max 5MB.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donation Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setForm({ ...form, amount: amount.toString() })}
                        className={`py-3 px-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                          form.amount === amount.toString()
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:scale-105'
                        }`}
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    placeholder="Share your thoughts or words of encouragement..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 resize-none"
                  />
                </div>

                <button
                  onClick={handleDonate}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 fill-current" />
                      Donate Now
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  🔒 Secure payment powered by Razorpay
                </p>
              </div>
            </div>
          </div>

          {/* Donors Section */}
          <div className={`space-y-6 transition-all duration-700 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Top Donors */}
            {topDonors.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-lg font-bold text-gray-900">Top Donors</h3>
                </div>
                <div className="space-y-3">
                  {topDonors.map((donor, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                      <div className="relative">
                        <img
                          src={donor.photoUrl}
                          alt={donor.donorName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
                        />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{donor.donorName}</p>
                        <p className="text-sm font-bold text-blue-600">{formatCurrency(donor.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Donors */}
            {recentDonors.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-bold text-gray-900">Recent Donors</h3>
                </div>
                <div className="space-y-3">
                  {recentDonors.map((donor, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                      <img
                        src={donor.photoUrl}
                        alt={donor.donorName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{donor.donorName}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-blue-600 font-semibold">{formatCurrency(donor.amount)}</p>
                          <p className="text-xs text-gray-500">{formatDate(donor.paidAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Thank You Message */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
              <Sparkles className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-2">Thank You!</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Every donation, big or small, makes a huge difference. 
                Together, we're making quality education accessible to everyone, everywhere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}