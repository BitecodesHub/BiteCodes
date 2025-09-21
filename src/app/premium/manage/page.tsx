"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import ProtectedRoutes from '@/components/ProtectedRoute';
import { Crown, Calendar, CreditCard, Download, Users, Star, AlertCircle, CheckCircle, Clock, RefreshCw, ArrowLeft } from 'lucide-react';
import { PremiumAPI, usePremiumStatus, Purchase, Premium } from '@/app/utils/premiumApi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const PremiumManagementPage: React.FC = () => {
  const { user } = useAuth();
  const { premiumStatus, loading: statusLoading, error: statusError, refetch } = usePremiumStatus(user?.userid);
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [premiumHistory, setPremiumHistory] = useState<Premium[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      if (!user?.userid) return;

      setHistoryLoading(true);
      try {
        const history = await PremiumAPI.getPremiumHistory(user.userid);
        setPurchaseHistory(history.purchases || []);
        setPremiumHistory(history.premiumSubscriptions || []);
      } catch (error) {
        console.error('Error fetching purchase history:', error);
        toast.error('Failed to load purchase history');
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [user?.userid]);

  const handleCancelSubscription = async () => {
    if (!user?.userid) return;

    const confirmed = window.confirm(
      'Are you sure you want to cancel your premium subscription? This action cannot be undone and you will lose access to premium features.'
    );

    if (!confirmed) return;

    setCanceling(true);
    try {
      const success = await PremiumAPI.cancelPremiumSubscription(user.userid);
      if (success) {
        toast.success('Subscription cancelled successfully');
        refetch();
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        toast.error('Failed to cancel subscription');
      }
    } catch (error: any) {
      toast.error('Failed to cancel subscription: ' + error.message);
    } finally {
      setCanceling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'PENDING':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'FAILED':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'FAILED':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getRemainingDays = () => {
    if (!premiumStatus?.endDate) return null;
    const now = new Date();
    const endDate = new Date(premiumStatus.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <ProtectedRoutes>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Home
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Crown className="w-8 h-8 text-amber-600 mr-3" />
                    Premium Subscription
                  </h1>
                  <p className="text-gray-600 mt-1">Manage your premium subscription and view your benefits</p>
                </div>
              </div>
              <button
                onClick={refetch}
                disabled={statusLoading}
                className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${statusLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Subscription Status */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Plan */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Current Plan</h2>

                {statusLoading ? (
                  <div className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-lg"></div>
                  </div>
                ) : statusError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
                    <p className="text-red-500">{statusError}</p>
                    <button
                      onClick={refetch}
                      className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                    >
                      Retry
                    </button>
                  </div>
                ) : premiumStatus ? (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Crown className="w-6 h-6 text-amber-600 mr-2" />
                        <div>
                          <h3 className="text-lg font-semibold text-amber-900">
                            Premium {premiumStatus.subscriptionType || 'Plan'}
                          </h3>
                          <p className="text-amber-700 text-sm">
                            {premiumStatus.hasPremium ? 'Active subscription' : 'Inactive'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {premiumStatus.subscriptionType === 'LIFETIME' ? (
                          <div>
                            <div className="text-2xl font-bold text-amber-900">∞</div>
                            <div className="text-sm text-amber-700">Lifetime</div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-2xl font-bold text-amber-900">
                              {getRemainingDays() || 0} days
                            </div>
                            <div className="text-sm text-amber-700">remaining</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                      {premiumStatus.startDate && (
                        <div>
                          <span className="text-amber-700 font-medium">Start Date:</span>
                          <span className="text-amber-800 ml-2">
                            {formatDateShort(premiumStatus.startDate)}
                          </span>
                        </div>
                      )}
                      {premiumStatus.endDate && (
                        <div>
                          <span className="text-amber-700 font-medium">End Date:</span>
                          <span className="text-amber-800 ml-2">
                            {premiumStatus.subscriptionType === 'LIFETIME'
                              ? 'Lifetime'
                              : formatDateShort(premiumStatus.endDate)}
                          </span>
                        </div>
                      )}
                    </div>

                    {premiumStatus.subscriptionType !== 'LIFETIME' && premiumStatus.hasPremium && (
                      <div className="pt-4 border-t border-amber-200">
                        <button
                          onClick={handleCancelSubscription}
                          disabled={canceling}
                          className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50 transition-colors"
                        >
                          {canceling ? 'Cancelling...' : 'Cancel Subscription'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Unable to load premium status</p>
                  </div>
                )}
              </div>

              {/* Purchase History */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Purchase History</h2>

                {historyLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading purchase history...</p>
                  </div>
                ) : purchaseHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No purchase history found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchaseHistory.map((purchase, index) => (
                      <div key={purchase.id || index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                purchase.purchaseStatus
                              )}`}
                            >
                              {getStatusIcon(purchase.purchaseStatus)}
                              <span className="ml-1">{purchase.purchaseStatus}</span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {formatDateShort(purchase.purchaseDate)}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">₹{purchase.finalAmount}</div>
                            {purchase.discountAmount > 0 && (
                              <div className="text-xs text-green-600">
                                ₹{purchase.discountAmount} saved
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{purchase.subscriptionType} Subscription</span>
                            <span className="font-mono text-xs text-gray-500">
                              {purchase.transactionId}
                            </span>
                          </div>
                          {purchase.couponCode && (
                            <div className="text-green-600 flex items-center">
                              <Star className="w-3 h-3 mr-1" />
                              Coupon applied: {purchase.couponCode}
                            </div>
                          )}
                          <div className="text-gray-500">
                            Payment via {purchase.paymentMethod || 'Razorpay'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Premium Benefits */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Premium Benefits</h3>

                <div className="space-y-4">
                  {[
                    { icon: Users, title: 'Unlimited Mock Tests', description: 'Access to all practice tests' },
                    { icon: Download, title: 'Download PDFs', description: 'Download study materials offline' },
                    { icon: Star, title: 'Priority Support', description: '24/7 premium customer support' },
                    { icon: Crown, title: 'Exclusive Content', description: 'Premium-only courses and materials' },
                    { icon: Calendar, title: 'Advanced Analytics', description: 'Detailed performance insights' },
                    { icon: AlertCircle, title: 'Ad-Free Experience', description: 'No advertisements while studying' },
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{benefit.title}</h4>
                        <p className="text-xs text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <Crown className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-4">Thank you for being a premium member!</p>
                    <Link
                      href="/help"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Need Help?
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoutes>
  );
};

export default PremiumManagementPage;