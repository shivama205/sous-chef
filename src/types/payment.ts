export interface PhonePePaymentRequest {
  merchantId: string
  merchantTransactionId: string
  merchantUserId: string
  amount: number
  redirectUrl: string
  redirectMode: 'POST' | 'GET'
  callbackUrl: string
  paymentInstrument: {
    type: 'PAY_PAGE'
  }
  mobileNumber?: string
}

export interface PhonePePaymentResponse {
  success: boolean
  code: string
  message: string
  data: {
    merchantId: string
    merchantTransactionId: string
    instrumentResponse: {
      type: string
      redirectInfo: {
        url: string
        method: string
      }
    }
  }
}

export interface PhonePeVerificationRequest {
  merchantId: string
  merchantTransactionId: string
  saltKey: string
  saltIndex: string
}

export interface PhonePeVerificationResponse {
  success: boolean
  code: string
  message: string
  data: {
    merchantId: string
    merchantTransactionId: string
    transactionId: string
    amount: number
    state: 'COMPLETED' | 'FAILED' | 'PENDING'
    responseCode: string
    paymentInstrument: {
      type: string
    }
  }
}

export interface RedirectInfo {
  url: string;
  method: string;
}

export interface InstrumentResponse {
  redirectInfo: RedirectInfo;
}

export interface PhonePeResponseData {
  instrumentResponse: InstrumentResponse;
}

export interface PhonePeResponseDetails {
  success: boolean;
  code: string;
  message?: string;
  data: PhonePeResponseData;
}

export interface PhonePeResponse {
  payment_id: string;
  phonepe_response: PhonePeResponseDetails;
}

export interface PaymentVerificationResponse {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  transaction_id?: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'failed'
  client_secret: string
  metadata?: Record<string, string>
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_transfer'
  card?: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
}

export interface PaymentRequest {
  amount: number // Amount in paise
  user_id: string
  callback_url: string
  redirect_url: string
}

export interface PaymentRedirectInfo {
  url: string
  method: string
}

export interface PaymentResponse {
  success: boolean
  code: string
  data: {
    merchantId: string
    merchantTransactionId: string
    instrumentResponse: {
      type: string
      redirectInfo: PaymentRedirectInfo
    }
  }
}

export interface PaymentVerification {
  transaction_id: string
  payment_response: string
}

export interface VerificationResponse {
  is_valid: boolean
}

export type PaymentStatus = 'INITIATED' | 'COMPLETED' | 'FAILED' | 'PENDING' 