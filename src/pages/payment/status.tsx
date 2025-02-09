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
        <Card className="max-w-lg mx-auto p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            {isSuccess ? (
              <>
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                  <CheckCircle2 className="w-20 h-20 mx-auto text-green-500 relative" />
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                    Payment Successful!
                  </h1>
                  <p className="text-muted-foreground">
                    Thank you for supporting MySideChef. Your contribution helps us grow! 🙏
                  </p>
                </motion.div>
                {transactionDetails && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-accent/5 rounded-lg p-4 space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-left space-y-1">
                        <p className="text-xs text-muted-foreground">Amount Paid</p>
                        <p className="font-semibold">₹{parseInt(transactionDetails.amount) / 100}</p>
                      </div>
                      <div className="text-left space-y-1">
                        <p className="text-xs text-muted-foreground">Transaction ID</p>
                        <p className="font-semibold">{transactionDetails.transactionId}</p>
                      </div>
                      <div className="text-left space-y-1">
                        <p className="text-xs text-muted-foreground">Reference ID</p>
                        <p className="font-semibold">{transactionDetails.providerReferenceId}</p>
                      </div>
                      <div className="text-left space-y-1">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="font-semibold text-green-500">Completed</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                  <XCircle className="w-20 h-20 mx-auto text-red-500 relative" />
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    Payment Failed
                  </h1>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      We couldn't process your payment. This could be due to:
                    </p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                        Payment was declined by your bank
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                        Network connectivity issues
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                        Transaction timeout
                      </li>
                    </ul>
                    <p className="text-sm text-muted-foreground bg-accent/5 p-3 rounded-lg">
                      Don't worry, no money has been deducted from your account.
                    </p>
                  </div>
                </motion.div>
              </>
            )}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-4"
            >
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </motion.div>
          </motion.div>
        </Card>
      </div>
    </BaseLayout>
  );
} 