import { useState, useEffect } from "react";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Coffee, Pizza, Gift, Sparkles, DollarSign, IndianRupee } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

declare global {
  interface Window {
    paypal: any;
  }
}

const paypalAmounts = [
  { value: "5", label: "$5", icon: Coffee, description: "Buy us a coffee" },
  { value: "15", label: "$15", icon: Pizza, description: "Buy us a pizza" },
  { value: "50", label: "$50", icon: Gift, description: "You're awesome!" },
];

const phonepeAmounts = [
  { value: "99", label: "₹99", icon: Coffee, description: "Buy us a coffee" },
  { value: "299", label: "₹299", icon: Pizza, description: "Buy us a pizza" },
  { value: "999", label: "₹999", icon: Gift, description: "You're awesome!" },
];

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;

export function Pricing() {
  const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'phonepe'>('paypal');
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePhonePePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const amountInPaise = Math.round(parseFloat(amount) * 100);
      
      const response = await fetch(`${API_BASE_URL}/payment/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInPaise,
          user_id: user?.id || '',
          callback_url: `${window.location.origin}/api/payment/process-callback`,
          redirect_url: `${window.location.origin}/payment/status`,
          mobile_number: user?.phone || undefined
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) throw new Error(data.error?.message || 'Payment initiation failed');

      if (data.data.paymentUrl) {
        window.location.href = data.data.paymentUrl;
      } else {
        throw new Error('Invalid payment response: Missing payment URL');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountSelect = (value: string) => {
    setAmount(value);
  };

  return (
    <BaseLayout>
      <SEO 
        title="Support MySideChef"
        description="Help us keep MySideChef running and growing. Your support means the world to us!"
        keywords="support, donation, contribute, paypal, phonepe, payment"
        type="website"
        canonical="https://mysidechef.com/support-us"
      />
      
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <Heart className="w-4 h-4" />
            Support Us
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold">
            Help Us Keep
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MySideChef Growing
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your support helps us maintain and improve MySideChef, keeping it free for everyone.
          </p>
        </motion.div>

        {/* Payment Methods Section */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Payment Method Selection */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* PayPal Card */}
              <button
                onClick={() => setSelectedMethod('paypal')}
                className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
                  selectedMethod === 'paypal' 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-border hover:border-primary/50 bg-white/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">PayPal</h3>
                    <p className="text-sm text-muted-foreground">International Payments</p>
                  </div>
                </div>
                {selectedMethod === 'paypal' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                )}
              </button>

              {/* PhonePe Card */}
              <button
                onClick={() => setSelectedMethod('phonepe')}
                className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
                  selectedMethod === 'phonepe' 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-border hover:border-primary/50 bg-white/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <IndianRupee className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">PhonePe</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Recommended for India</span>
                    </div>
                    <p className="text-sm text-muted-foreground">UPI & Card Payments in INR</p>
                  </div>
                </div>
                {selectedMethod === 'phonepe' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                )}
              </button>
            </div>

            {/* Payment Details Card */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              {selectedMethod === 'paypal' ? (
                <div className="space-y-6">
                  <div className="text-sm text-center space-y-2">
                    <p className="font-medium">International Supporters</p>
                    <p className="text-muted-foreground">Secure payments in USD via PayPal</p>
                  </div>

                  {/* Common Contribution Patterns */}
                  <div className="bg-accent/5 rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-medium text-center">What others typically contribute:</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="space-y-1">
                        <div className="text-2xl font-semibold text-primary">$5</div>
                        <div className="text-xs text-muted-foreground">Most Common</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-semibold text-primary">$15</div>
                        <div className="text-xs text-muted-foreground">Average</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-semibold text-primary">$50+</div>
                        <div className="text-xs text-muted-foreground">Power Users</div>
                      </div>
                    </div>
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      Choose any amount you're comfortable with
                    </p>
                  </div>

                  {/* PayPal Payment Button */}
                  <Button 
                    asChild
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
                  >
                    <a 
                      href="https://www.paypal.com/ncp/payment/34TW5MBGYE576" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      Support Us with PayPal
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-sm text-center space-y-2">
                    <p className="font-medium">Indian Supporters</p>
                    <p className="text-muted-foreground">Quick & easy payments via UPI/Cards in INR</p>
                  </div>

                  {/* PhonePe Amount Input */}
                  <div className="space-y-2">
                    <Label>Amount (INR)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-8"
                        placeholder="Enter amount"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* PhonePe Suggested Amounts */}
                  <div className="grid grid-cols-3 gap-3">
                    {phonepeAmounts.map((suggestion) => {
                      const Icon = suggestion.icon;
                      return (
                        <button
                          key={suggestion.value}
                          onClick={() => handleAmountSelect(suggestion.value)}
                          className={`
                            p-3 rounded-lg text-center transition-all duration-200
                            ${amount === suggestion.value 
                              ? 'bg-primary text-white ring-2 ring-primary/20' 
                              : 'bg-primary/5 hover:bg-primary/10'
                            }
                          `}
                        >
                          <Icon className={`w-5 h-5 mx-auto mb-1 ${amount === suggestion.value ? 'text-white' : 'text-primary'}`} />
                          <div className={`text-sm font-medium ${amount === suggestion.value ? 'text-white' : 'text-primary'}`}>
                            {suggestion.label}
                          </div>
                          <div className={`text-xs ${amount === suggestion.value ? 'text-white/80' : 'text-muted-foreground'}`}>
                            {suggestion.description}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* PhonePe Button */}
                  <Button
                    onClick={handlePhonePePayment}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
                    disabled={isLoading || !amount}
                  >
                    {isLoading ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-2" />
                        Support Us with PhonePe
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-center text-muted-foreground">
                  {selectedMethod === 'paypal' 
                    ? "International payments are processed securely via PayPal"
                    : "Recommended for Indian users - Quick UPI/Card payments via PhonePe"}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Your Support Helps Us</h2>
              <p className="text-lg text-muted-foreground">
                Here's how your contribution makes a difference:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-transparent border-0">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Improve Features</h3>
                <p className="text-sm text-muted-foreground">
                  Develop new AI features and enhance existing ones
                </p>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-transparent border-0">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                  <Coffee className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Keep it Free</h3>
                <p className="text-sm text-muted-foreground">
                  Help us maintain servers and keep MySideChef free for everyone
                </p>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-transparent border-0">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Add More Recipes</h3>
                <p className="text-sm text-muted-foreground">
                  Expand our recipe database with more diverse options
                </p>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </BaseLayout>
  );
}
