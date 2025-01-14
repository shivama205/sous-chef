import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import NavigationBar from "@/components/NavigationBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Billing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <NavigationBar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your subscription and usage details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Pro Plan</h3>
                  <p className="text-sm text-gray-600">$19/month • Renews on May 1, 2024</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Meal Plans Used</span>
                    <span>15/20</span>
                  </div>
                  <Progress value={75} />
                  
                  <div className="flex justify-between text-sm mt-4">
                    <span>Healthy Swaps</span>
                    <span>Unlimited</span>
                  </div>
                  <Progress value={100} />
                </div>

                <Button variant="secondary" className="mt-4">
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your recent invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">April 2024</p>
                    <p className="text-sm text-gray-600">Pro Plan</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$19.00</p>
                    <Button variant="ghost" className="text-sm">Download</Button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">March 2024</p>
                    <p className="text-sm text-gray-600">Pro Plan</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$19.00</p>
                    <Button variant="ghost" className="text-sm">Download</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Billing;