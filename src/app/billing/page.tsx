"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useAuth } from '@/app/contexts/AuthContext';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Download, 
  Filter,
  Search,
  Crown,
  Receipt,
  ArrowUpDown,
  AlertCircle,
  RefreshCw,
  Loader2,
  User,
  DollarSign,
  FileText,
  Eye,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PremiumSubscription {
  id: number;
  startDate: string;
  endDate: string;
  subscriptionType: string;
  amountPaid: number;
  transactionId: string;
  isActive: boolean;
  couponUsed: string | null;
  discountApplied: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

interface Purchase {
  id: number;
  transactionId: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  subscriptionType: string;
  couponCode: string | null;
  purchaseStatus: string;
  paymentId: string | null;
  paymentMethod: string;
  purchaseDate: string;
  updatedAt: string;
  user?: any;
}

interface BillingData {
  premiumSubscriptions: PremiumSubscription[];
  purchases: Purchase[];
}

const BillingPage: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showSubscriptions, setShowSubscriptions] = useState(true);
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  const fetchBillingData = useCallback(async () => {
    if (!user?.userid || !isLoggedIn) {
      setError('Please login to view billing history');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiUrl}/api/premium/history/${user.userid}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch billing data: ${response.status} ${response.statusText}`);
      }
      
      const data: BillingData = await response.json();
      setBillingData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch billing history');
      console.error('Error fetching billing data:', err);
      toast.error('Failed to load billing history');
    } finally {
      setLoading(false);
    }
  }, [user?.userid, isLoggedIn]);

  useEffect(() => {
    fetchBillingData();
  }, [fetchBillingData]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlanDisplayName = (type: string): string => {
    const planNames: { [key: string]: string } = {
      'MONTHLY': '1 Month Plan',
      'QUARTERLY': '3 Months Plan',
      'HALF_YEARLY': '6 Months Plan',
      'YEARLY': '1 Year Plan',
      'LIFETIME': 'Lifetime Plan'
    };
    return planNames[type] || type;
  };

  const filterAndSortPurchases = (): Purchase[] => {
    if (!billingData?.purchases) return [];
    
    let filtered = billingData.purchases.filter(purchase => {
      const matchesSearch = purchase.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           purchase.subscriptionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (purchase.paymentId && purchase.paymentId.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterStatus === 'ALL' || purchase.purchaseStatus === filterStatus;
      
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.purchaseDate).getTime();
          bValue = new Date(b.purchaseDate).getTime();
          break;
        case 'amount':
          aValue = a.finalAmount;
          bValue = b.finalAmount;
          break;
        case 'status':
          aValue = a.purchaseStatus;
          bValue = b.purchaseStatus;
          break;
        default:
          aValue = new Date(a.purchaseDate).getTime();
          bValue = new Date(b.purchaseDate).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const handleDownloadInvoice = async (transactionId: string) => {
    try {
      toast.loading('Preparing invoice download...');
      // Simulate API call for invoice download
      const response = await fetch(`${apiUrl}/api/premium/invoice/${transactionId}`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${transactionId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Invoice downloaded successfully!');
      } else {
        throw new Error('Failed to download invoice');
      }
    } catch (error) {
      console.error('Invoice download error:', error);
      toast.error('Failed to download invoice. Please try again.');
    }
  };

  const handleViewDetails = (purchase: Purchase) => {
    // Create a modal or navigate to details page
    toast.success(`Viewing details for transaction: ${purchase.transactionId}`);
    // You can implement a modal here or navigate to a details page
  };

  if (!isLoggedIn) {
    return (
      <>
        <Head>
          <title>Login Required - Billing History | Bitecodes Academy</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
            <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-700 mb-6">Please login to view your billing history</p>
            <a
              href="/login"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              Login to Continue
            </a>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Billing History... | Bitecodes Academy</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-700 text-lg font-medium">Loading your billing history...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Error Loading Billing History | Bitecodes Academy</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={fetchBillingData}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  const filteredPurchases = filterAndSortPurchases();
  const totalSpent = billingData?.purchases?.reduce((sum, purchase) => 
    purchase.purchaseStatus === 'COMPLETED' ? sum + purchase.finalAmount : sum, 0) || 0;
  const activeSubscription = billingData?.premiumSubscriptions?.find(sub => sub.isActive);

  return (
    <>
      <Head>
        <title>Billing History & Subscriptions | Bitecodes Academy</title>
        <meta name="description" content="View your premium subscription billing history, invoices, and payment details for Bitecodes Academy." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing History</h1>
                <p className="text-gray-600">Manage your subscriptions and view payment history</p>
              </div>
              <button
                onClick={fetchBillingData}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Subscription</p>
                  <p className="text-lg font-bold text-gray-900">
                    {activeSubscription ? getPlanDisplayName(activeSubscription.subscriptionType) : 'None'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{billingData?.purchases?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Subscription Details */}
          {activeSubscription && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <Crown className="w-6 h-6 mr-2" />
                    <h3 className="text-xl font-bold">Active Premium Subscription</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-blue-100 text-sm">Plan</p>
                      <p className="font-semibold">{getPlanDisplayName(activeSubscription.subscriptionType)}</p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm">Started</p>
                      <p className="font-semibold">{formatDate(activeSubscription.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm">Expires</p>
                      <p className="font-semibold">{formatDate(activeSubscription.endDate)}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm">Amount Paid</p>
                  <p className="text-2xl font-bold">{formatCurrency(activeSubscription.amountPaid)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by transaction ID, payment ID, or plan type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="ALL">All Status</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>

                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder as 'asc' | 'desc');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="date-desc">Latest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="amount-desc">Highest Amount</option>
                  <option value="amount-asc">Lowest Amount</option>
                  <option value="status-asc">Status A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Purchase History */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Purchase History</h3>
            </div>

            {filteredPurchases.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'ALL' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'You haven\'t made any purchases yet'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPurchases.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {purchase.transactionId}
                            </div>
                            {purchase.paymentId && (
                              <div className="text-xs text-gray-500">
                                Payment: {purchase.paymentId}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {getPlanDisplayName(purchase.subscriptionType)}
                          </div>
                          {purchase.couponCode && (
                            <div className="text-xs text-green-600">
                              Coupon: {purchase.couponCode}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(purchase.finalAmount)}
                          </div>
                          {purchase.discountAmount > 0 && (
                            <div className="text-xs text-green-600">
                              Saved: {formatCurrency(purchase.discountAmount)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(purchase.purchaseStatus)}`}>
                            {getStatusIcon(purchase.purchaseStatus)}
                            <span className="ml-1">{purchase.purchaseStatus}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(purchase.purchaseDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {purchase.purchaseStatus === 'COMPLETED' && (
                              <button
                                onClick={() => handleDownloadInvoice(purchase.transactionId)}
                                className="text-blue-600 hover:text-blue-900 flex items-center p-1 rounded hover:bg-blue-50 transition-all"
                                title="Download Invoice"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleViewDetails(purchase)}
                              className="text-gray-600 hover:text-gray-900 flex items-center p-1 rounded hover:bg-gray-50 transition-all"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-8 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Have questions about your billing or need assistance with your subscription?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/support"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                >
                  Contact Support
                </a>
                <a
                  href="/help"
                  className="inline-flex items-center px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingPage;