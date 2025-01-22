import { 
  type PhonePePaymentRequest, 
  type PhonePePaymentResponse, 
  type PhonePeVerificationRequest, 
  type PhonePeVerificationResponse 
} from '@/types/payment'

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8000'
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
  }: {
    amount: number
    userId: string
    callbackUrl: string
    redirectUrl: string
    mobileNumber?: string
  }): Promise<PhonePePaymentResponse> {
    const response = await fetch(`${API_BASE_URL}/api/payments/initiate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount,
        user_id: userId,
        callback_url: callbackUrl,
        redirect_url: redirectUrl,
        mobile_number: mobileNumber
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to initiate payment')
    }

    return response.json()
  },

  async verifyPayment(merchantTransactionId: string): Promise<PhonePeVerificationResponse> {
    const response = await fetch(`${API_BASE_URL}/api/payments/verify/${merchantTransactionId}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to verify payment')
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