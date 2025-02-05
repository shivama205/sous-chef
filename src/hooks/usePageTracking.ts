import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { dataLayer } from '@/services/dataLayer';

export const usePageTracking = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const consent = localStorage.getItem('analytics-consent');
    if (consent === 'accepted') {
      dataLayer.trackPageView({
        page_path: location.pathname,
        page_title: document.title,
        user_id: user?.id,
      });
    }
  }, [location, user]);
}; 