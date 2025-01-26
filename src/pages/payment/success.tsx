import { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2 } from "lucide-react";

interface PhonePeCallback {
  code: string;
  merchantId: string;
  transactionId: string;
  amount: string;
  providerReferenceId: string;
  checksum: string;
}

interface PaymentStatus {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: string;
    responseCode: string;
    responseMessage: string;
  };
}

export function PaymentSuccess() {
  const location = useLocation();
  const { toast } = useToast();
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

    // Function to handle payment verification
    const verifyPayment = async (callback: PhonePeCallback) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/api/payment/process-callback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(callback),
          }
        );

        const data = await response.json();
        setStatus(data);

        if (!data.success) {
          toast({
            title: "Payment Verification Failed",
            description: data.message || "Failed to verify payment status",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        toast({
          title: "Error",
          description: "Failed to verify payment status",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Check if we have form data in the state
    const formData = new FormData();
    const searchParams = new URLSearchParams(location.search);
    
    // Handle both GET and POST scenarios
    if (location.state?.formData) {
      // Handle POST data from form submission
      const callback = parseFormData(location.state.formData);
      verifyPayment(callback);
    } else if (searchParams.has("code")) {
      // Handle GET parameters (fallback)
      const callback = {
        code: searchParams.get("code") || "",
        merchantId: searchParams.get("merchantId") || "",
        transactionId: searchParams.get("transactionId") || "",
        amount: searchParams.get("amount") || "",
        providerReferenceId: searchParams.get("providerReferenceId") || "",
        checksum: searchParams.get("checksum") || "",
      };
      verifyPayment(callback);
    } else {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Invalid payment response",
        variant: "destructive",
      });
    }
  }, [location, toast]);

  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-lg mx-auto p-8">
          {isLoading ? (
            <div className="text-center">
              <p className="text-lg">Verifying payment status...</p>
            </div>
          ) : status?.success && status.data.state === "COMPLETED" ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
              <h1 className="text-2xl font-bold text-green-500">
                Payment Successful!
              </h1>
              <p className="text-gray-600">
                Thank you for your payment. Your transaction was successful.
              </p>
              <div className="mt-6 space-y-2 text-left">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Transaction ID:</span>{" "}
                  {status.data.transactionId}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Amount:</span> ₹
                  {status.data.amount / 100}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Status:</span>{" "}
                  {status.data.responseMessage}
                </p>
              </div>
              <div className="mt-8">
                <Button
                  onClick={() => window.location.href = "/dashboard"}
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-red-500">
                Payment Verification Failed
              </h1>
              <p className="text-gray-600">
                {status?.message || "Something went wrong while verifying your payment."}
              </p>
              <div className="mt-8">
                <Button
                  onClick={() => window.location.href = "/pricing"}
                  variant="outline"
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </BaseLayout>
  );
} 