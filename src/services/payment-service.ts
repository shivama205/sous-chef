import { 
  type PhonePePaymentResponse, 
  type PhonePeVerificationResponse 
} from '@/types/payment'

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8080'
const API_KEY = import.meta.env.VITE_BACKEND_API_KEY

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY || '',
}

export const paymentService = {
  async initiatePayment({
    amount,
    userId,
    callbackUrl,
    redirectUrl,
    mobileNumber,
    email,
  }: {
    amount: number
    userId: string
    callbackUrl: string
    redirectUrl: string
    mobileNumber?: string
    email?: string
  }): Promise<PhonePePaymentResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/initiate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount,
        user_id: userId,
        callback_url: callbackUrl,
        redirect_url: redirectUrl,
        mobile_number: mobileNumber,
        email
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail?.[0]?.msg || 'Failed to initiate payment')
    }

    return response.json()
  },

  async checkPaymentStatus(transactionId: string): Promise<PhonePeVerificationResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/status/${transactionId}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail?.[0]?.msg || 'Failed to check payment status')
    }

    return response.json()
  },

  async initiateRefund({
    transactionId,
    refundAmount,
    refundType = 'REGULAR'
  }: {
    transactionId: string
    refundAmount: number
    refundType?: 'REGULAR' | 'INSTANT'
  }) {
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/refund`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        transaction_id: transactionId,
        refund_amount: refundAmount,
        refund_type: refundType
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail?.[0]?.msg || 'Failed to initiate refund')
    }

    return response.json()
  },

  async checkRefundStatus(transactionId: string, refundId: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/refund/status/${transactionId}/${refundId}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail?.[0]?.msg || 'Failed to check refund status')
    }

    return response.json()
  },

  handlePaymentRedirect(redirectInfo: { url: string; method: string }) {
    if (redirectInfo.method === 'POST') {
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = redirectInfo.url
      document.body.appendChild(form)
      form.submit()
    } else {
      window.location.href = redirectInfo.url
    }
  }
} 