import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const CONSENT_KEY = 'analytics-consent';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consentValue = localStorage.getItem(CONSENT_KEY);
    if (!consentValue) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setIsVisible(false);
    
    // Update GTM dataLayer with consent
    if (window.dataLayer) {
      window.dataLayer.push({
        'event': 'update_consent',
        'analytics_storage': 'granted'
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setIsVisible(false);
    
    // Update GTM dataLayer with consent
    if (window.dataLayer) {
      window.dataLayer.push({
        'event': 'update_consent',
        'analytics_storage': 'denied'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-0 left-0 right-0 p-4 z-50"
      >
        <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm shadow-lg border-primary/10">
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">🍪 Cookie Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  We use cookies to analyze our website traffic and optimize your website experience. 
                  By accepting our use of cookies, your data will be aggregated with all other user data.
                  You can learn more about how we use cookies in our{' '}
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDecline}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button
                variant="outline"
                onClick={handleDecline}
                className="flex-1 sm:order-1"
              >
                Decline
              </Button>
              <Button
                onClick={handleAccept}
                className="flex-1 sm:order-2"
              >
                Accept All
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}; 