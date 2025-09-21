"use client";
import React, { useState, useEffect, useCallback } from 'react';
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
  const [selectedPlan, setSelectedPlan] = useState<string>('YEARLY');
  const [plans, setPlans] = useState<PremiumPricing>({});
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponDetails | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

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
      const pricing = await PremiumAPI.getPremiumPricing();
      if (Object.keys(pricing).length > 0) {
        setPlans(pricing);
        const popularPlan = Object.keys(pricing).find(key => pricing[key].popular);
        setSelectedPlan(popularPlan || Object.keys(pricing)[0] || 'YEARLY');
      } else {
        throw new Error('No pricing plans available');
      }
    } catch (error: any) {
      console.error('Error fetching pricing:', error);
      toast.error(error.message || 'Failed to load pricing information');
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
      'Unlimited Mock Tests',
      'Advanced Analytics',
      'Priority Support',
      'Exclusive Content',
      'Download PDFs',
      'No Ads',
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
        description: `Premium ${selectedPlan} Subscription`,
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
    { icon: Zap, title: 'Unlimited Access', description: 'Access to all premium content and features' },
    { icon: Shield, title: 'Priority Support', description: '24/7 premium customer support' },
    { icon: Crown, title: 'Advanced Analytics', description: 'Detailed performance insights and reports' },
    { icon: Star, title: 'Exclusive Content', description: 'Premium-only study materials and courses' },
    { icon: Clock, title: 'Download Content', description: 'Download PDFs and study offline' },
    { icon: Gift, title: 'Ad-Free Experience', description: 'Enjoy learning without any interruptions' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-700 text-lg font-medium">Loading premium plans...</p>
        </div>
      </div>
    );
  }

  if (isPremiumUser()) {
    return (
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
    );
  }

  if (Object.keys(plans).length === 0) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Upgrade to Premium</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            Unlock unlimited access to all features, premium content, and advanced tools to accelerate your learning journey.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Plan</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {Object.entries(plans).map(([type, plan]) => (
                  <div
                    key={type}
                    className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedPlan === type ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300'
                    } ${plan.popular ? 'ring-2 ring-blue-200' : ''}`}
                    onClick={() => {
                      setSelectedPlan(type);
                      setAppliedCoupon(null);
                      setCouponCode('');
                    }}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-2 text-base">{plan.duration}</h3>
                      <div className="text-2xl font-bold text-gray-900 mb-1">₹{plan.price.toLocaleString()}</div>
                      <p className="text-sm text-green-700 font-semibold">{plan.savings}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Coupon Section - Enhanced visibility */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Have a coupon code?</h3>
                {!appliedCoupon ? (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
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
                      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center min-w-[100px] justify-center"
                    >
                      {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Gift className="w-5 h-5 text-green-600 mr-2" />
                        <div>
                          <p className="font-semibold text-green-900 text-base">{appliedCoupon.name}</p>
                          <p className="text-sm text-green-700 font-medium">{appliedCoupon.discountPercentage}% off applied</p>
                        </div>
                      </div>
                      <button onClick={removeCoupon} className="text-green-700 hover:text-green-900 p-1" title="Remove coupon">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Price Summary Section - Enhanced visibility */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-medium text-base">Original Price</span>
                    <span className="font-semibold text-gray-900 text-base">₹{plans[selectedPlan]?.price.toLocaleString()}</span>
                  </div>
                  {appliedCoupon && calculateDiscountAmount() > 0 && (
                    <div className="flex justify-between items-center text-green-700">
                      <span className="font-medium text-base">Discount ({appliedCoupon.discountPercentage}% off)</span>
                      <span className="font-semibold text-base">-₹{calculateDiscountAmount().toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
                    <span className="text-gray-900 font-bold text-xl">Total Amount</span>
                    <span className="font-bold text-gray-900 text-2xl">₹{calculateFinalAmount().toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={handlePurchase}
                  disabled={purchasing || !isLoggedIn || !plans[selectedPlan]}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all text-lg"
                >
                  {purchasing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5" />
                      <span>Upgrade to Premium</span>
                    </>
                  )}
                </button>
                {!isLoggedIn && (
                  <div className="mt-4 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-700 mr-2" />
                    <p className="text-sm text-yellow-800 font-medium">Please login to continue with purchase</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Premium Features</h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                      <p className="text-sm text-gray-700">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                <p className="text-sm text-blue-900 text-center font-medium">
                  <strong className="text-blue-900">Money Back Guarantee</strong><br />
                  30-day risk-free trial. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPurchasePage;