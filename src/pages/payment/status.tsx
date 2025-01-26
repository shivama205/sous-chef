import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
  checksum: string;
}

export function PaymentStatus() {
  const location = useLocation();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<PhonePeCallback | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Function to parse form data from POST request
    const parseFormData = (formData: FormData): PhonePeCallback => {
      return {
        code: formData.get("code") as string,
        merchantId: formData.get("merchantId") as string,
        transactionId: formData.get("transactionId") as string,
        amount: formData.get("amount") as string,
        providerReferenceId: formData.get("providerReferenceId") as string,
        checksum: formData.get("checksum") as string,
      };
    };

    // Check if we have form data in the state
    const searchParams = new URLSearchParams(location.search);
    let paymentData: PhonePeCallback | null = null;

    // Handle both GET and POST scenarios
    if (location.state?.formData) {
      // Handle POST data from form submission
      paymentData = parseFormData(location.state.formData);
    } else if (searchParams.has("code")) {
      // Handle GET parameters
      paymentData = {
        code: searchParams.get("code") || "",
        merchantId: searchParams.get("merchantId") || "",
        transactionId: searchParams.get("transactionId") || "",
        amount: searchParams.get("amount") || "",
        providerReferenceId: searchParams.get("providerReferenceId") || "",
        checksum: searchParams.get("checksum") || "",
      };
    }

    if (paymentData) {
      setTransactionDetails(paymentData);
      const isPaymentSuccess = paymentData.code === "PAYMENT_SUCCESS";
      setIsSuccess(isPaymentSuccess);
      
      if (isPaymentSuccess) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
      }

      toast({
        title: isPaymentSuccess ? "Payment Successful" : "Payment Failed",
        description: isPaymentSuccess 
          ? `Transaction ${paymentData.transactionId} completed successfully.`
          : `Transaction ${paymentData.transactionId} failed. Please try again.`,
        variant: isPaymentSuccess ? "default" : "destructive",
      });
    } else {
      const error = searchParams.get("error");
      if (error) {
        toast({
          title: "Payment Failed",
          description: decodeURIComponent(error),
          variant: "destructive",
        });
      }
    }
  }, [location, toast]);

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