"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Loader,
  Shield,
  Download,
  Copy,
  Calendar,
  Building2,
  Receipt,
  IndianRupee,
  RefreshCw,
} from "lucide-react";

/* ================= TYPES ================= */
interface ReceiptData {
  receiptNumber: string;
  amount: number;
  status: string; // e.g. "PAID", "PENDING", "FAILED"
  date: string;
  organization: string;
}

interface VerificationResponse {
  success: boolean;
  verified: boolean;
  message: string;
  data: ReceiptData;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/* ================= ANIMATED COMPONENTS (unchanged) ================= */
const AnimatedShield = () => (
  <div className="relative w-32 h-32 mx-auto mb-6">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full animate-pulse"></div>
    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
      <Shield className="w-16 h-16 text-blue-600" />
    </div>
    <div className="absolute -inset-2 border-4 border-blue-200 rounded-full animate-ping opacity-75"></div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-3">
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
        <div className="flex-1 h-4 bg-gray-100 rounded"></div>
      </div>
    ))}
  </div>
);

const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none z-50">
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-blue-500 rounded-full animate-confetti"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${1 + Math.random() * 2}s`,
        }}
      />
    ))}
  </div>
);

/* ================= MAIN COMPONENT ================= */
export default function ReceiptVerificationPage() {
  const params = useParams();
  const receiptNumber = params?.receiptNumber as string;
  const containerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [rechecking, setRechecking] = useState<boolean>(false);

  const fetchVerification = async () => {
    if (!receiptNumber) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/receipts/verify/${encodeURIComponent(receiptNumber)}`
      );
      const json: VerificationResponse = await res.json();
      if (!json || !json.success) {
        setError(json?.message || "Verification failed");
        setData(json ?? null);
      } else {
        setData(json);
        // If backend verifies, show confetti when appropriate
        if (json.verified) {
          setTimeout(() => setShowConfetti(true), 400);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      }
    } catch (e) {
      console.error(e);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
      setRechecking(false);
    }
  };

  useEffect(() => {
    if (!receiptNumber) return;
    fetchVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiptNumber]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(receiptNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReceipt = () => {
    // In a real implementation, this would generate a PDF
    alert(`Downloading receipt ${receiptNumber}...`);
  };

  const recheck = async () => {
    setRechecking(true);
    await fetchVerification();
  };

  /* ------------------ Derived status logic (fixed) ------------------ */
  // Build a canonical status and display text that takes both verification flag
  // and gateway 'status' into account. This prevents contradictory UI.
  const computeStatus = (resp: VerificationResponse | null) => {
    if (!resp) return { display: "Unknown", state: "unknown" };

    const r = resp.data;
    const statusRaw = (r?.status || "").toString().trim().toLowerCase();

    const paymentPaid = ["paid", "success", "completed"].some((s) =>
      statusRaw.includes(s)
    );
    const paymentPending = ["pending", "inprogress", "in_progress"].some((s) =>
      statusRaw.includes(s)
    );
    const paymentFailed = ["failed", "error", "refunded", "reversed"].some((s) =>
      statusRaw.includes(s)
    );

    const verified = !!resp.verified;

    // cases:
    // - verified && paymentPaid => Verified & Paid (green)
    // - verified && !paymentPaid && paymentPending => Verified (Payment Pending)
    // - !verified && paymentPaid => Payment Paid (Unverified) -> show mismatch (warning)
    // - paymentPending && !verified => Payment Pending (warning)
    // - paymentFailed => Payment Failed / Refunded (red)
    // default -> Unknown / Pending

    if (verified && paymentPaid) return { display: "Verified & Paid", state: "green" };
    if (verified && paymentPending) return { display: "Verified (Payment Pending)", state: "amber" };
    if (verified && !paymentPaid && !paymentPending && !paymentFailed)
      return { display: "Verified (payment status unknown)", state: "amber" };

    if (!verified && paymentPaid) return { display: "Payment Paid (Unverified)", state: "amber" };
    if (!verified && paymentPending) return { display: "Payment Pending (Unverified)", state: "amber" };
    if (paymentFailed) return { display: "Payment Failed / Refunded", state: "red" };

    // fallback: use verified boolean
    if (verified) return { display: "Verified", state: "green" };
    return { display: "Payment Pending", state: "amber" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <Shield className="w-12 h-12 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Verifying Receipt</h2>
            <p className="text-gray-600">Checking authenticity with Bitecodes Academy</p>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all duration-300 hover:scale-[1.02]">
          <div className="relative">
            <XCircle className="w-24 h-24 text-red-500 mx-auto animate-shake" />
            <div className="absolute -inset-4 bg-red-100 rounded-full opacity-50 animate-pulse"></div>
          </div>
          <h2 className="text-3xl font-bold mt-6 text-gray-800">Verification Failed</h2>
          <p className="text-gray-600 mt-2 mb-6">{error || "Invalid verification response"}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
            <button
              onClick={recheck}
              className="px-6 py-3 rounded-lg border border-gray-200 bg-white font-semibold hover:shadow"
              disabled={rechecking}
            >
              {rechecking ? "Rechecking..." : "Re-check"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // At this point data exists (could be success or success:false with payload)
  const resp = data!;
  const r = resp.data;
  const statusInfo = computeStatus(resp);
  const isGreen = statusInfo.state === "green";
  const isRed = statusInfo.state === "red";
  const isAmber = statusInfo.state === "amber";

  const headerIcon = isGreen ? (
    <div className="relative inline-block">
      <CheckCircle className="w-32 h-32 text-green-500 mx-auto animate-bounce-in" />
      <div className="absolute -inset-6 bg-green-100 rounded-full animate-ping opacity-30"></div>
    </div>
  ) : (
    <div className="relative inline-block">
      <XCircle className="w-32 h-32 text-amber-500 mx-auto animate-pulse" />
      <div className="absolute -inset-6 bg-amber-100 rounded-full animate-pulse opacity-30"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Confetti Animation */}
      {showConfetti && <Confetti />}

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-64 h-64 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div ref={containerRef} className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-slide-up">
        {/* Header with Animated Status */}
        <div className="text-center mb-8">
          {headerIcon}

          <h1 className="text-4xl font-bold mt-6 bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
            {statusInfo.display}
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            {resp.message || "Receipt verification result."}
          </p>

          {/* Add a small note when there is a mismatch between payment gateway status and verification flag */}
          {!resp.verified && r?.status && /paid|success|completed/i.test(r.status) && (
            <p className="text-sm text-amber-700 mt-2">
              Note: Payment gateway reports <strong>{r.status}</strong> but server verification did not confirm authenticity. Try re-checking or contact support.
            </p>
          )}

          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-50 rounded-full">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Verified from Bitecodes Academy servers</span>
          </div>
        </div>

        {/* Animated Receipt Card */}
        <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-2xl p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Receipt className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Receipt Details</h3>
                <p className="text-gray-500 text-sm">Transaction #{receiptNumber}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 group relative"
              >
                <Copy className="w-5 h-5 text-blue-600" />
                {copied && (
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>
              <button
                onClick={downloadReceipt}
                className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300"
              >
                <Download className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>

          {/* Details Grid with Staggered Animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Receipt, label: "Receipt Number", value: r?.receiptNumber ?? "—", color: "blue" },
              { icon: IndianRupee, label: "Amount", value: r?.amount != null ? `₹${r.amount}` : "—", color: "green" },
              { icon: Calendar, label: "Date", value: r?.date ?? "—", color: "purple" },
              { icon: Building2, label: "Organization", value: r?.organization ?? "—", color: "amber" },
            ].map((item, index) => (
              <div
                key={item.label}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`p-3 rounded-lg`} style={{ background: "rgba(59,130,246,0.06)" }}>
                  <item.icon className={`w-6 h-6 text-blue-600`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                  <p className="text-lg font-semibold text-gray-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Status Badge */}
          <div className="mt-6 flex justify-center items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold ${
                isGreen ? "bg-green-50 text-green-700" : isRed ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${isGreen ? "bg-green-500" : isRed ? "bg-red-500" : "bg-amber-500"}`}></div>
              {statusInfo.display}
            </div>

            {/* Recheck Button */}
            <button
              onClick={recheck}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:shadow transition"
              disabled={rechecking}
            >
              <RefreshCw className="w-4 h-4" />
              {rechecking ? "Rechecking..." : "Re-check"}
            </button>
          </div>
        </div>

        {/* Watermark */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Secured by Bitecodes Academy • {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>

      {/* Global CSS Animations (unchanged) */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        @keyframes confetti {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-bounce-in { animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-confetti { animation: confetti linear forwards; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
