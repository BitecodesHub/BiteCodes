"use client";
import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface PremiumPricing {
  [key: string]: {
    type: string;
    price: number;
    duration: string;
    savings: string;
    popular?: boolean;
  };
}

export interface CouponValidationResponse {
  valid: boolean;
  code: string;
  name: string;
  discountPercentage: number;
  maxDiscountAmount?: number;
  minPurchaseAmount?: number;
  message?: string;
}

export interface CreateOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  subscriptionType: string;
  couponApplied?: boolean;
  couponCode?: string;
  couponName?: string;

}

export interface PaymentVerificationRequest {
  userId: number | string;
  paymentId: string;
  orderId: string;
  signature: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  premiumStatus?: {
    hasPremium: boolean;
    subscriptionType: string | null;
    startDate: string | null;
    endDate: string | null;
    daysRemaining: number;
  };
}

export interface PremiumHistory {
  purchases: Purchase[];
  premiumSubscriptions: Premium[];
}

export interface Purchase {
  id?: number | string;
  userId?: number | string;
  transactionId?: string;
  originalAmount?: number;
  discountAmount: number;
  finalAmount: number;
  subscriptionType: string;
  couponCode?: string;
  purchaseStatus: string;
  paymentMethod?: string;
  purchaseDate: string;
  updatedAt?: string;
}

export interface Premium {
  id?: number | string;
  hasPremium?: boolean;
  startDate?: string;
  endDate?: string;
  subscriptionType: string;
  amountPaid?: number;
  transactionId?: string;
  isActive?: boolean;
  couponUsed?: string;
  discountApplied?: number;
  createdAt?: string;
  updatedAt?: string;
  daysRemaining?: number;
}

export interface PremiumStatusResponse {
  hasPremium: boolean;
  subscriptionType?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  daysRemaining?: number;
}

export class PremiumAPI {
  private static getAuthHeaders() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
    }
    return { 'Content-Type': 'application/json' };
  }

  private static handleApiError(error: any, defaultMessage: string): Error {
    console.error('API Error:', error);
    return new Error(error.response?.data?.message || error.response?.data?.error || error.message || defaultMessage);
  }

  static async getPremiumPricing(): Promise<PremiumPricing> {
    try {
      const response = await axios.get(`${API_URL}/api/premium/pricing`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid pricing data format');
      }
      const normalized: PremiumPricing = {};
      Object.entries(response.data).forEach(([key, plan]: [string, any]) => {
        normalized[key] = {
          type: key,
          price: plan.price,
          duration: plan.duration,
          savings: plan.savings,
          popular: plan.popular,
        };
      });
      console.log('✅ Fetched premium pricing:', normalized);
      return normalized;
    } catch (error) {
      throw this.handleApiError(error, 'Failed to fetch premium pricing');
    }
  }

  static async getPremiumStatus(userId: number | string): Promise<PremiumStatusResponse> {
    try {
      if (!userId || (typeof userId === 'number' && userId <= 0)) {
        throw new Error('Invalid user ID');
      }
      console.log(`🗳 Fetching premium status for userId: ${userId}`);
      const response = await axios.get(`${API_URL}/api/premium/status/${userId}`, {
        headers: this.getAuthHeaders(),
      });
      console.log('✅ Fetched premium status:', response.data);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error, 'Failed to fetch premium status');
    }
  }

  static async validateCoupon(code: string, userId: number | string, subscriptionType: string): Promise<CouponValidationResponse> {
    try {
      if (!code?.trim()) {
        return {
          valid: false,
          code,
          name: '',
          discountPercentage: 0,
          message: 'Coupon code is required',
        };
      }
      if (!userId || (typeof userId === 'number' && userId <= 0)) {
        return {
          valid: false,
          code,
          name: '',
          discountPercentage: 0,
          message: 'User authentication required',
        };
      }
      if (!subscriptionType?.trim()) {
        return {
          valid: false,
          code,
          name: '',
          discountPercentage: 0,
          message: 'Subscription type required',
        };
      }
      console.log(`🗳 Validating coupon: ${code} for userId: ${userId}, subscriptionType: ${subscriptionType}`);
      const response = await axios.post(
        `${API_URL}/api/premium/validate-coupon`,
        {},
        {
          params: {
            couponCode: code.trim().toUpperCase(),
            userId,
            subscriptionType: subscriptionType.toUpperCase(),
          },
          headers: this.getAuthHeaders(),
        }
      );
      console.log('✅ Validated coupon:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error validating coupon:', error);
      return {
        valid: false,
        code,
        name: '',
        discountPercentage: 0,
        message: error.response?.data?.message || 'Invalid coupon code',
      };
    }
  }

  static async createPremiumOrder(userId: number | string, subscriptionType: string, couponCode?: string, paymentMethod: string = 'RAZORPAY', upiId?: string, appName: string = 'Bitecodes Academy'): Promise<CreateOrderResponse> {
    try {
      if (!userId || (typeof userId === 'number' && userId <= 0)) {
        throw new Error('User authentication required');
      }
      if (!subscriptionType?.trim()) {
        throw new Error('Subscription type is required');
      }
      const payload = {
        subscriptionType: subscriptionType.trim().toUpperCase(),
        paymentMethod,
        upiId: upiId || null,
        appName,
        couponCode: couponCode?.trim() || null,
      };
      console.log('🗳 Creating premium order with payload:', payload);
      const response = await axios.post(`${API_URL}/api/premium/purchase/${userId}`, payload, {
        headers: this.getAuthHeaders(),
      });
      if (!response.data?.razorpayOrderId) {
        throw new Error('Invalid order response from server');
      }
      console.log('✅ Created premium order:', response.data);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error, 'Failed to create order');
    }
  }

  static async verifyPayment(paymentData: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
    try {
      console.log('🗳 Sending verify-payment payload:', paymentData);
      if (!paymentData.userId || (typeof paymentData.userId === 'number' && paymentData.userId <= 0)) {
        throw new Error('User ID is required');
      }
      if (!paymentData.paymentId?.trim()) {
        throw new Error('Payment ID is required');
      }
      if (!paymentData.orderId?.trim()) {
        throw new Error('Order ID is required');
      }
      if (!paymentData.signature?.trim()) {
        throw new Error('Payment signature is required');
      }
      const payload = {
        userId: paymentData.userId.toString(),
        razorpay_payment_id: paymentData.paymentId,
        razorpay_order_id: paymentData.orderId,
        razorpay_signature: paymentData.signature,
      };
      const response = await axios.post(`${API_URL}/api/premium/verify-payment`, payload, {
        headers: this.getAuthHeaders(),
      });
      console.log('✅ Payment verification response:', response.data);
      return response.data;
    } catch (error) {
      throw this.handleApiError(error, 'Payment verification failed');
    }
  }

  static async getPremiumHistory(userId: number | string): Promise<PremiumHistory> {
    try {
      if (!userId || (typeof userId === 'number' && userId <= 0)) {
        throw new Error('User authentication required');
      }
      console.log(`🗳 Fetching premium history for userId: ${userId}`);
      const response = await axios.get(`${API_URL}/api/premium/history/${userId}`, {
        headers: this.getAuthHeaders(),
      });
      console.log('✅ Fetched premium history:', response.data);
      return {
        purchases: Array.isArray(response.data.purchases) ? response.data.purchases : [],
        premiumSubscriptions: Array.isArray(response.data.premiumSubscriptions) ? response.data.premiumSubscriptions : [],
      };
    } catch (error) {
      throw this.handleApiError(error, 'Failed to fetch purchase history');
    }
  }

  static async cancelPremiumSubscription(userId: number | string): Promise<boolean> {
    try {
      if (!userId || (typeof userId === 'number' && userId <= 0)) {
        throw new Error('User authentication required');
      }
      console.log(`🗳 Cancelling premium subscription for userId: ${userId}`);
      const response = await axios.post(`${API_URL}/api/premium/cancel/${userId}`, {}, {
        headers: this.getAuthHeaders(),
      });
      console.log('✅ Cancel subscription response:', response.data);
      return response.data?.success || false;
    } catch (error) {
      throw this.handleApiError(error, 'Failed to cancel subscription');
    }
  }

  static isPremiumActive(premiumStatus: PremiumStatusResponse | null): boolean {
    if (!premiumStatus || !premiumStatus.hasPremium || !premiumStatus.endDate) {
      return false;
    }
    const endDate = new Date(premiumStatus.endDate);
    const now = new Date();
    return endDate > now;
  }

  static getRemainingDays(endDate: string | null): number {
    if (!endDate) return 0;
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }
}

// Custom hook to fetch and manage premium status
export const usePremiumStatus = (userId?: number | string) => {
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPremiumStatus = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      setError('No user ID provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const status = await PremiumAPI.getPremiumStatus(userId);
      setPremiumStatus(status);
    } catch (err) {
      const errorMessage = err instanceof AxiosError && err.response?.data?.error
        ? err.response.data.error
        : err instanceof Error
        ? err.message
        : 'Failed to fetch premium status';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPremiumStatus();
  }, [fetchPremiumStatus]);

  const refetch = () => {
    fetchPremiumStatus();
  };

  return { premiumStatus, loading, error, refetch };
};