import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle, Receipt, Home } from "lucide-react";
import Confetti from 'react-confetti';
import { motion } from "framer-motion";

interface PhonePeCallback {
  code: string;
  merchantId: string;
  transactionId: string;
  amount: string;
  providerReferenceId: string;
  merchantOrderId: string;
  checksum: string;
}

export function PaymentStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<PhonePeCallback | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Function to process payment response
    const processPaymentResponse = (data: PhonePeCallback) => {
      setTransactionDetails(data);
      const isPaymentSuccess = data.code === "PAYMENT_SUCCESS";
      setIsSuccess(isPaymentSuccess);
      
      if (isPaymentSuccess) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

      toast({
        title: isPaymentSuccess ? "Payment Successful" : "Payment Failed",
        description: isPaymentSuccess 
          ? `Transaction ${data.transactionId} completed successfully.`
          : `Transaction ${data.transactionId} failed. Please try again.`,
        variant: isPaymentSuccess ? "default" : "destructive",
      });
    };

    // Function to handle form data
    const handleFormData = () => {
      // Get all form inputs
      const inputs = document.querySelectorAll('input[type="hidden"]');
      if (inputs.length > 0) {
        const data = {
          code: '',
          merchantId: '',
          transactionId: '',
          amount: '',
          providerReferenceId: '',
          merchantOrderId: '',
          checksum: ''
        } as PhonePeCallback;

        inputs.forEach((input: HTMLInputElement) => {
          if (input.name in data) {
            (data as any)[input.name] = input.value;
          }
        });
        
        // Verify we have all required fields
        if (data.code && data.merchantId && data.transactionId) {
          processPaymentResponse(data);
          return true;
        }
      }
      return false;
    };

    // Function to handle URL parameters
    const handleUrlParams = () => {
      const params = new URLSearchParams(location.search);
      if (params.has('code')) {
        const data = {
          code: params.get('code') || '',
          merchantId: params.get('merchantId') || '',
          transactionId: params.get('transactionId') || '',
          amount: params.get('amount') || '',
          providerReferenceId: params.get('providerReferenceId') || '',
          merchantOrderId: params.get('merchantOrderId') || '',
          checksum: params.get('checksum') || ''
        };
        processPaymentResponse(data);
        return true;
      }
      return false;
    };

    // Handle error from redirect
    const handleError = () => {
      const params = new URLSearchParams(location.search);
      const error = params.get('error');
      if (error) {
        setIsSuccess(false);
        toast({
          title: "Payment Failed",
          description: decodeURIComponent(error),
          variant: "destructive",
        });
        return true;
      }
      return false;
    };

    // Process the payment response
    const processResponse = async () => {
      try {
        // Try to handle form data first (POST response)
        if (handleFormData()) {
          return;
        }

        // Then try URL parameters (GET response)
        if (handleUrlParams()) {
          return;
        }

        // Finally check for error parameters
        if (handleError()) {
          return;
        }

        // If none of the above, show error
        toast({
          title: "Invalid Response",
          description: "Could not process payment response",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processResponse();
  }, [location, toast]);

  if (isProcessing) {
    return (
      <BaseLayout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-lg mx-auto p-8">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full" />
              </motion.div>
              <p className="mt-4 text-lg">Processing payment response...</p>
            </div>
          </Card>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-lg mx-auto p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            {isSuccess ? (
              <>
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
                </motion.div>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-green-500"
                >
                  Payment Successful!
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600"
                >
                  Thank you for your payment. Your subscription has been activated.
                </motion.p>
                {transactionDetails && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 space-y-2 text-left"
                  >
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Transaction ID:</span>{" "}
                      {transactionDetails.transactionId}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Amount:</span> ₹
                      {parseInt(transactionDetails.amount) / 100}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Reference ID:</span>{" "}
                      {transactionDetails.providerReferenceId}
                    </p>
                  </motion.div>
                )}
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 mx-auto text-red-500" />
                <h1 className="text-2xl font-bold text-red-500">Payment Failed</h1>
                <p className="text-gray-600">
                  We couldn't process your payment. This could be due to:
                </p>
                <ul className="text-left text-gray-600 list-disc list-inside space-y-2">
                  <li>Payment was declined by your bank</li>
                  <li>Network connectivity issues</li>
                  <li>Transaction timeout</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Don't worry, no money has been deducted from your account.
                </p>
              </>
            )}
            <div className="mt-8 space-y-4">
              <Button
                onClick={() => window.location.href = "/billing"}
                className="w-full flex items-center justify-center gap-2"
                variant={isSuccess ? "default" : "outline"}
              >
                <Receipt className="w-4 h-4" />
                View Transaction History
              </Button>
              <Button
                onClick={() => window.location.href = "/"}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Homepage
              </Button>
            </div>
          </motion.div>
        </Card>
      </div>
    </BaseLayout>
  );
} 