import { useState } from 'react'
import { paymentService } from '@/services/payment-service'
import type { PhonePePaymentResponse, PhonePeVerificationResponse } from '@/types/payment'

interface UsePaymentProps {
  onInitiateSuccess?: (response: PhonePePaymentResponse) => void
  onVerifySuccess?: (response: PhonePeVerificationResponse) => void
  onError?: (error: Error) => void
}

export function usePayment({ onInitiateSuccess, onVerifySuccess, onError }: UsePaymentProps = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const initiatePayment = async ({
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
  }) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await paymentService.initiatePayment({
        amount,
        userId,
        callbackUrl,
        redirectUrl,
        mobileNumber,
      })
      
      onInitiateSuccess?.(response)

      // Handle redirect to PhonePe payment page
      paymentService.handlePaymentRedirect(response.data.instrumentResponse.redirectInfo)
      
      return response
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Payment initiation failed')
      setError(error)
      onError?.(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const verifyPayment = async (merchantTransactionId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await paymentService.verifyPayment(merchantTransactionId)
      
      if (response.data.state === 'COMPLETED') {
        onVerifySuccess?.(response)
      }
      
      return response
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Payment verification failed')
      setError(error)
      onError?.(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    initiatePayment,
    verifyPayment,
  }
} 