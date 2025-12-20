"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Heart, 
  Download, 
  Calendar, 
  Mail, 
  UserCircle, 
  DollarSign,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Donation {
  id: number;
  amount: number;
  donorName: string;
  donorEmail: string;
  message: string;
  receiptNumber: string;
  status: string;
  paidAt: string;
  createdAt: string;
}

interface DonationHistoryResponse {
  donations: Donation[];
  currentPage: number;
  totalPages: number;
  totalDonations: number;
  pageSize: number;
}

export default function MyDonationsPage() {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const PAGE_SIZE = 10;

  const { user, getToken } = useAuth();
  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      fetchDonations(0);
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  }, []);

  const fetchDonations = async (page: number) => {
    const token = getToken();
    if (!token) {
      setError("Authentication token is missing. Please sign in again.");
      router.push("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/api/donations/history?page=${page}&size=${PAGE_SIZE}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please sign in again.");
        }
        throw new Error("Failed to load donation history");
      }

      const data: DonationHistoryResponse = await response.json();
      
      setDonations(data.donations || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalDonations(data.totalDonations);
    } catch (err: any) {
      console.error("Error fetching donations:", err);
      if (err.message.includes("Authentication failed")) {
        setError(err.message);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(err.message || "Failed to load donations. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReceipt = async (donationId: number) => {
  const token = getToken();

  if (!token) {
    alert("Please sign in to download receipt");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/donations/receipt/${donationId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download receipt");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `donation-receipt-${donationId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Receipt download error:", error);
    alert("Unable to download receipt. Please try again.");
  }
};


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      fetchDonations(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <Heart className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your donation history
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-blue-600 fill-current" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Donations</h1>
                <p className="text-gray-600">Your contribution history</p>
              </div>
            </div>
            <Link
              href="/donate"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Heart className="w-4 h-4 mr-2" />
              Donate Again
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Card */}
        {totalDonations > 0 && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Donations</p>
                <p className="text-3xl font-bold">{totalDonations}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm mb-1">Total Amount</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(donations.reduce((sum, d) => sum + d.amount, 0))}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/6"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchDonations(currentPage)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : donations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No donations yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start making a difference today by supporting our mission
            </p>
            <Link
              href="/donate"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Heart className="w-4 h-4 mr-2" />
              Make Your First Donation
            </Link>
          </div>
        ) : (
          <>
            {/* Donations List */}
            <div className="space-y-4">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Heart className="w-6 h-6 text-white fill-current" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(donation.amount)}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(donation.paidAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {donation.status}
                        </span>
                        {donation.receiptNumber && (
                          <p className="text-xs text-gray-500 mt-2">
                            Receipt: {donation.receiptNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <UserCircle className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{donation.donorName}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{donation.donorEmail}</span>
                      </div>
                    </div>

                    {donation.message && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-900 italic">
                          "{donation.message}"
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => handleDownloadReceipt(donation.id)}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between bg-white rounded-lg shadow-sm border p-4">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {currentPage * PAGE_SIZE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min((currentPage + 1) * PAGE_SIZE, totalDonations)}
                  </span>{" "}
                  of <span className="font-medium">{totalDonations}</span> donations
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}