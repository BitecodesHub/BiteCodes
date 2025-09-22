"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useAuth } from '@/app/contexts/AuthContext';
import { Check, Star, Crown, Zap, Shield, Clock, Gift, AlertCircle, Loader2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PremiumAPI, PremiumPricing, CouponValidationResponse, CreateOrderResponse, PaymentVerificationResponse } from '@/app/utils/premiumApi';

interface SubscriptionPlan {
  type: string;
  price: number;
  duration: string;
  savings: string;
  popular?: boolean;
}

interface CouponDetails {
  code: string;
  name: string;
  discountPercentage: number;
  maxDiscountAmount?: number;
  minPurchaseAmount?: number;
  valid: boolean;
  message?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PremiumPurchasePage: React.FC = () => {
  const { user, isLoggedIn, updatePremiumStatus, isPremiumUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>('MONTHLY');
  const [plans, setPlans] = useState<PremiumPricing>({});
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponDetails | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // Enhanced pricing plans with attractive starting price
  const enhancedPlans = {
    MONTHLY: { price: 99, duration: '1 Month', savings: 'Perfect for starters', popular: false },
    QUARTERLY: { price: 249, duration: '3 Months', savings: 'Save 16%', popular: false },
    HALF_YEARLY: { price: 449, duration: '6 Months', savings: 'Save 24%', popular: true },
    YEARLY: { price: 799, duration: '1 Year', savings: 'Save 33%', popular: false },
    LIFETIME: { price: 1999, duration: 'Lifetime', savings: 'Best Value - Save 80%', popular: false }
  };

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const existingScript = document.getElementById('razorpay-script');
        if (existingScript) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.id = 'razorpay-script';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };
    loadRazorpayScript();
  }, []);

  const fetchPricing = useCallback(async () => {
    try {
      setLoading(true);
      // Use enhanced plans with attractive pricing
      setPlans(enhancedPlans as PremiumPricing);
      setSelectedPlan('MONTHLY');
    } catch (error: any) {
      console.error('Error fetching pricing:', error);
      // Fallback to enhanced plans if API fails
      setPlans(enhancedPlans as PremiumPricing);
      setSelectedPlan('MONTHLY');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    if (!user?.userid) {
      toast.error('Please login to apply coupon');
      return;
    }
    if (!selectedPlan) {
      toast.error('Please select a plan first');
      return;
    }
    setCouponLoading(true);
    try {
      const response = await PremiumAPI.validateCoupon(couponCode.trim(), user.userid, selectedPlan);
      if (response.valid) {
        setAppliedCoupon(response);
        toast.success(`Coupon applied! ${response.discountPercentage}% off`);
      } else {
        toast.error(response.message || 'Invalid or expired coupon');
        setAppliedCoupon(null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to apply coupon');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const calculateFinalAmount = () => {
    const originalAmount = plans[selectedPlan]?.price || 0;
    if (!appliedCoupon) return originalAmount;
    const discount = (originalAmount * appliedCoupon.discountPercentage) / 100;
    const maxDiscount = appliedCoupon.maxDiscountAmount || discount;
    return Math.max(0, originalAmount - Math.min(discount, maxDiscount));
  };

  const calculateDiscountAmount = () => {
    const originalAmount = plans[selectedPlan]?.price || 0;
    return originalAmount - calculateFinalAmount();
  };

  const calculateExpiryDate = (planType: string): string => {
    const now = new Date();
    switch (planType.toUpperCase()) {
      case 'MONTHLY': return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
      case 'QUARTERLY': return new Date(now.setMonth(now.getMonth() + 3)).toISOString();
      case 'HALF_YEARLY': return new Date(now.setMonth(now.getMonth() + 6)).toISOString();
      case 'YEARLY': return new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();
      case 'LIFETIME': return new Date(now.setFullYear(now.getFullYear() + 100)).toISOString();
      default: return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
    }
  };

  const getPremiumFeatures = (): string[] => {
    return [
      'AI-Powered Mock Tests',
      'Personalized Learning Path',
      'Advanced Performance Analytics',
      'Priority Support 24/7',
      'Download PDFs & Study Offline',
      'Ad-Free Learning Experience',
      'Exclusive Video Content',
      'Smart Revision Planner',
    ];
  };

  const handlePurchase = async () => {
    if (!isLoggedIn || !user || !user.userid) {
      toast.error('Please login to continue');
      return;
    }
    if (!plans[selectedPlan]) {
      toast.error('Please select a valid plan');
      return;
    }
    if (!window.Razorpay) {
      toast.error('Payment system not loaded. Please refresh the page.');
      return;
    }
    setPurchasing(true);
    try {
      const orderResponse: CreateOrderResponse = await PremiumAPI.createPremiumOrder(
        user.userid,
        selectedPlan,
        appliedCoupon?.code
      );
      const { razorpayOrderId, amount, currency } = orderResponse;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RDc7AGHUscKt8H',
        amount,
        currency: currency || 'INR',
        name: 'Bitecodes Academy',
        description: `Premium ${selectedPlan} Subscription - AI Powered Learning`,
        order_id: razorpayOrderId,
        prefill: {
          name: user.name || 'User',
          email: user.email || '',
        },
        theme: {
          color: '#3B82F6',
        },
        handler: async (response: any) => {
          try {
            console.log('Razorpay response:', response);
            if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
              console.error('Incomplete Razorpay response:', response);
              toast.error('Payment response is incomplete. Please try again.');
              return;
            }
            const verifyResponse: PaymentVerificationResponse = await PremiumAPI.verifyPayment({
              userId: user.userid,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });
            if (verifyResponse.success && verifyResponse.premiumStatus) {
              updatePremiumStatus({
                isPremium: verifyResponse.premiumStatus.hasPremium,
                plan: verifyResponse.premiumStatus.subscriptionType || selectedPlan,
                expiresAt: verifyResponse.premiumStatus.endDate || calculateExpiryDate(selectedPlan),
                features: getPremiumFeatures(),
              });
              toast.success('Premium subscription activated successfully!');
              setTimeout(() => {
                window.location.href = '/premium/manage';
              }, 2000);
            } else {
              console.error('Payment verification failed:', verifyResponse);
              toast.error(verifyResponse.message || 'Payment verification failed');
            }
          } catch (error: any) {
            console.error('Payment verification error:', error.response?.data || error);
            toast.error(error.message || 'Payment verification failed');
          } finally {
            setPurchasing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPurchasing(false);
            toast('Payment cancelled', { icon: 'ℹ️' });
          },
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        console.error('Razorpay payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`);
        setPurchasing(false);
      });
      razorpay.open();
    } catch (error: any) {
      console.error('Payment initiation error:', error.response?.data || error);
      toast.error(error.message || 'Failed to initiate payment');
      setPurchasing(false);
    }
  };

  const features = [
    { icon: Zap, title: 'AI-Powered Tests', description: 'Smart mock tests that adapt to your learning level' },
    { icon: Shield, title: 'Priority Support', description: '24/7 premium customer support' },
    { icon: Crown, title: 'Advanced Analytics', description: 'AI-driven performance insights and reports' },
    { icon: Star, title: 'Exclusive Content', description: 'Premium-only study materials and courses' },
    { icon: Clock, title: 'Download Content', description: 'Download PDFs and study offline anytime' },
    { icon: Gift, title: 'Ad-Free Experience', description: 'Focus on learning without interruptions' },
  ];

  if (loading) {
    return (
      <>
        <Head>
          <title>Premium Membership Starting at ₹99 Only | Bitecodes Academy</title>
          <meta name="description" content="Unlock AI-powered mock tests & premium features at just ₹99. Join Bitecodes Academy for entrance exam success with smart learning tools." />
          <meta name="keywords" content="premium membership, entrance exam mock tests, AI learning, bitecodes academy, ₹99 offer, competitive exams" />
          <meta property="og:title" content="Premium at ₹99 Only - AI Powered Mock Tests | Bitecodes Academy" />
          <meta property="og:description" content="Get premium access to AI-driven mock tests, advanced analytics, and exclusive content starting at just ₹99. Boost your exam preparation today!" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://bitecodes.com/premium" />
          <meta property="og:image" content="https://bitecodes.com/images/premium-og-image.jpg" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Premium Membership ₹99 - Bitecodes Academy" />
          <meta name="twitter:description" content="AI-powered entrance exam preparation starting at just ₹99. Unlimited mock tests with smart analytics." />
          <link rel="canonical" href="https://bitecodes.com/premium" />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-700 text-lg font-medium">Loading premium plans...</p>
          </div>
        </div>
      </>
    );
  }

  if (isPremiumUser()) {
    return (
      <>
        <Head>
          <title>You're Already Premium! | Bitecodes Academy</title>
          <meta name="description" content="Thank you for being a premium member at Bitecodes Academy. Enjoy exclusive AI-powered learning features and advanced mock tests." />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">You're Already Premium!</h1>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for being a premium member. Enjoy all the exclusive features!
              </p>
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Your Premium Benefits</h3>
                <ul className="space-y-2 text-left">
                  {getPremiumFeatures().map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-800 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-x-4">
                <a
                  href="/premium/manage"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-orange-600 transition-all"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Manage Subscription
                </a>
                <a
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (Object.keys(plans).length === 0) {
    return (
      <>
        <Head>
          <title>Premium Plans Unavailable | Bitecodes Academy</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Plans Available</h2>
            <p className="text-gray-700 mb-6 text-lg">Premium plans are currently unavailable. Please try again later.</p>
            <button
              onClick={fetchPricing}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              <Loader2 className="w-4 h-4 mr-2" />
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Premium Membership Starting at ₹99 Only | AI-Powered Mock Tests - Bitecodes Academy</title>
        <meta name="description" content="Unlock AI-powered entrance exam mock tests & premium features at just ₹99. Join Bitecodes Academy for smart learning, advanced analytics, and guaranteed success." />
        <meta name="keywords" content="premium membership ₹99, AI mock tests, entrance exam preparation, bitecodes academy, competitive exams, smart learning, affordable education" />
        <meta property="og:title" content="Premium at ₹99 Only - AI Powered Mock Tests | Bitecodes Academy" />
        <meta property="og:description" content="Get premium access to AI-driven mock tests, advanced analytics, and exclusive content starting at just ₹99. Boost your exam preparation today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bitecodes.com/premium" />
        <meta property="og:image" content="https://bitecodes.com/images/premium-og-image.jpg" />
        <meta property="og:site_name" content="Bitecodes Academy" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Premium Membership ₹99 - AI Powered Learning | Bitecodes Academy" />
        <meta name="twitter:description" content="AI-powered entrance exam preparation starting at just ₹99. Unlimited mock tests with smart analytics and personalized learning paths." />
        <meta name="twitter:image" content="https://bitecodes.com/images/premium-twitter-image.jpg" />
        <link rel="canonical" href="https://bitecodes.com/premium" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Bitecodes Academy Premium Membership",
            "description": "AI-powered entrance exam preparation with unlimited mock tests and advanced analytics",
            "brand": {
              "@type": "Brand",
              "name": "Bitecodes Academy"
            },
            "offers": {
              "@type": "Offer",
              "price": "99",
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "Bitecodes Academy"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "1250"
            }
          })}
        </script>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section with Price Highlight */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full text-white font-bold text-sm mb-4">
              <Zap className="w-4 h-4 mr-1" />
              SPECIAL OFFER: STARTING AT JUST ₹99!
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Upgrade to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI-Powered Premium</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium mb-2">
              Unlock smart mock tests, personalized learning paths, and advanced analytics
            </p>
            <div className="flex justify-center items-center space-x-2 text-lg text-green-700 font-semibold">
              <Star className="w-5 h-5 fill-current" />
              <span>Trusted by 50,000+ students for entrance exam success</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your AI-Powered Plan</h2>
                
                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {Object.entries(plans).map(([type, plan]) => (
                    <div
                      key={type}
                      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                        selectedPlan === type ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' : 'border-gray-200 hover:border-gray-300'
                      } ${plan.popular ? 'ring-2 ring-blue-200 shadow-xl' : ''}`}
                      onClick={() => {
                        setSelectedPlan(type);
                        setAppliedCoupon(null);
                        setCouponCode('');
                      }}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            MOST POPULAR
                          </span>
                        </div>
                      )}
                      {type === 'MONTHLY' && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          BEST VALUE
                        </div>
                      )}
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900 mb-2 text-base">{plan.duration}</h3>
                        <div className="text-2xl font-bold text-gray-900 mb-1">₹{plan.price.toLocaleString()}</div>
                        {type === 'MONTHLY' && (
                          <div className="text-sm text-green-700 font-semibold bg-green-50 px-2 py-1 rounded">
                            ⭐ Only ₹3.3/day!
                          </div>
                        )}
                        <p className="text-sm text-green-700 font-semibold mt-1">{plan.savings}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Coupon Section */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <div className="flex items-center mb-4">
                    <Gift className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Apply Coupon Code</h3>
                  </div>
                  {!appliedCoupon ? (
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Enter coupon code (e.g., WELCOME10)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base font-medium placeholder-gray-500 bg-white"
                          disabled={couponLoading}
                        />
                      </div>
                      <button
                        onClick={applyCoupon}
                        disabled={!couponCode.trim() || couponLoading}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center min-w-[100px] justify-center"
                      >
                        {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Gift className="w-5 h-5 text-green-600 mr-2" />
                          <div>
                            <p className="font-semibold text-green-900 text-base">{appliedCoupon.name}</p>
                            <p className="text-sm text-green-700 font-medium">{appliedCoupon.discountPercentage}% discount applied</p>
                          </div>
                        </div>
                        <button onClick={removeCoupon} className="text-green-700 hover:text-green-900 p-1" title="Remove coupon">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Price Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-medium text-base">Plan Price</span>
                      <span className="font-semibold text-gray-900 text-base">₹{plans[selectedPlan]?.price.toLocaleString()}</span>
                    </div>
                    {appliedCoupon && calculateDiscountAmount() > 0 && (
                      <div className="flex justify-between items-center text-green-700">
                        <span className="font-medium text-base">Discount ({appliedCoupon.discountPercentage}% off)</span>
                        <span className="font-semibold text-base">-₹{calculateDiscountAmount().toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t-2 border-blue-300 pt-3 flex justify-between items-center">
                      <span className="text-gray-900 font-bold text-xl">Final Amount</span>
                      <div className="text-right">
                        <span className="font-bold text-gray-900 text-2xl">₹{calculateFinalAmount().toLocaleString()}</span>
                        {selectedPlan === 'MONTHLY' && (
                          <p className="text-sm text-gray-600 mt-1">That's just ₹3.3 per day!</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing || !isLoggedIn || !plans[selectedPlan]}
                    className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all text-lg shadow-lg transform hover:scale-105"
                  >
                    {purchasing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing Your AI Access...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Get AI-Powered Premium Now</span>
                      </>
                    )}
                  </button>
                  {!isLoggedIn && (
                    <div className="mt-4 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg flex items-center">
                      <AlertCircle className="w-5 h-5 text-yellow-700 mr-2" />
                      <p className="text-sm text-yellow-800 font-medium">Please login to unlock premium features</p>
                    </div>
                  )}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-600">🔒 Secure payment powered by Razorpay</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">What You Get with Premium</h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                        <p className="text-sm text-gray-700">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-8 space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
                    <div className="flex items-center mb-2">
                      <Shield className="w-4 h-4 text-green-600 mr-2" />
                      <p className="text-sm font-semibold text-green-900">30-Day Money Back Guarantee</p>
                    </div>
                    <p className="text-xs text-green-800">Not satisfied? Get full refund within 30 days.</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200">
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-amber-600 mr-2" />
                      <p className="text-sm font-semibold text-amber-900">4.8/5 Rating from 12,500+ Students</p>
                    </div>
                    <p className="text-xs text-amber-800">Join our community of successful learners.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Boost Your Exam Preparation?</h3>
              <p className="text-lg mb-6 opacity-90">Join 50,000+ students who transformed their learning with AI-powered premium</p>
              <button
                onClick={handlePurchase}
                disabled={purchasing || !isLoggedIn}
                className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-all inline-flex items-center space-x-2"
              >
                <Crown className="w-5 h-5" />
                <span>Start Your Premium Journey at ₹99</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PremiumPurchasePage;