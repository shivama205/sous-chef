import { 
  type PhonePePaymentRequest, 
  type PhonePePaymentResponse, 
  type PhonePeVerificationRequest, 
  type PhonePeVerificationResponse 
} from '@/types/payment'

const PHONEPE_API_URL = import.meta.env.VITE_PHONEPE_API_URL || 'https://api.phonepe.com/apis/hermes'
const MERCHANT_ID = import.meta.env.VITE_PHONEPE_MERCHANT_ID
const SALT_KEY = import.meta.env.VITE_PHONEPE_SALT_KEY
const SALT_INDEX = import.meta.env.VITE_PHONEPE_SALT_INDEX

const headers = {
  'Content-Type': 'application/json',
  'X-VERIFY': '', // Will be set per request
}

function generateX_VERIFY(payload: string): string {
  // PhonePe's checksum generation logic
  // This should match their documentation for generating the X-VERIFY header
  // Usually involves base64 encoding and SHA256 hashing with the salt key
  return '' // Implement according to PhonePe docs
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
    const merchantTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).slice(2)}`
    
    const payload: PhonePePaymentRequest = {
      merchantId: MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: userId,
      amount: amount * 100, // Convert to paise
      redirectUrl,
      redirectMode: 'POST',
      callbackUrl,
      paymentInstrument: {
        type: 'PAY_PAGE'
      },
      mobileNumber
    }

    const xVerify = generateX_VERIFY(JSON.stringify(payload))
    
    const response = await fetch(`${PHONEPE_API_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: { ...headers, 'X-VERIFY': xVerify },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to initiate payment')
    }

    return response.json()
  },

  async verifyPayment(merchantTransactionId: string): Promise<PhonePeVerificationResponse> {
    const payload: PhonePeVerificationRequest = {
      merchantId: MERCHANT_ID,
      merchantTransactionId,
      saltKey: SALT_KEY,
      saltIndex: SALT_INDEX
    }

    const xVerify = generateX_VERIFY(JSON.stringify(payload))

    const response = await fetch(`${PHONEPE_API_URL}/pg/v1/status/${merchantTransactionId}`, {
      method: 'GET',
      headers: { ...headers, 'X-VERIFY': xVerify },
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