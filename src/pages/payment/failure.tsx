import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PhonePeCallback {
  code: string;
  merchantId: string;
  transactionId: string;
  amount: string;
  providerReferenceId: string;
  checksum: string;
}

export function PaymentFailure() {
  const location = useLocation();
  const { toast } = useToast();

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

    // Function to handle payment failure
    const handlePaymentFailure = async (callback: PhonePeCallback) => {
      try {
        // Notify backend about payment failure
        await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/api/payment/process-callback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(callback),
          }
        );
      } catch (error) {
        console.error("Error processing payment failure:", error);
      }
    };

    // Check if we have form data in the state
    const searchParams = new URLSearchParams(location.search);
    
    // Handle both GET and POST scenarios
    if (location.state?.formData) {
      // Handle POST data from form submission
      const callback = parseFormData(location.state.formData);
      handlePaymentFailure(callback);
      toast({
        title: "Payment Failed",
        description: `Transaction ${callback.transactionId} failed. Please try again.`,
        variant: "destructive",
      });
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
      handlePaymentFailure(callback);
      toast({
        title: "Payment Failed",
        description: `Transaction ${callback.transactionId} failed. Please try again.`,
        variant: "destructive",
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
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-lg mx-auto p-8">
          <div className="text-center space-y-4">
            <XCircle className="w-16 h-16 mx-auto text-red-500" />
            <h1 className="text-2xl font-bold text-red-500">Payment Failed</h1>
            <p className="text-gray-600">
              We couldn't process your payment. This could be due to:
            </p>
            <ul className="text-left text-gray-600 list-disc list-inside space-y-2">
              <li>Insufficient funds in your account</li>
              <li>Payment was declined by your bank</li>
              <li>Network connectivity issues</li>
              <li>Transaction timeout</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Don't worry, no money has been deducted from your account.
            </p>
            <div className="mt-8 space-y-4">
              <Button
                onClick={() => window.location.href = "/pricing"}
                className="w-full"
              >
                Try Again
              </Button>
              <Button
                onClick={() => window.location.href = "/support"}
                variant="outline"
                className="w-full"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </BaseLayout>
  );
} 