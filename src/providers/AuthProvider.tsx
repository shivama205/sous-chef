import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { dataLayer } from '@/services/dataLayer';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/profile',
  '/recipe/new',
  '/meal-plan',
  '/saved-recipes',
  '/settings'
];

// Keys for local storage
const LOCAL_STORAGE_KEYS = {
  PREFERENCES: 'user-preferences',
  MEAL_PLAN_DRAFT: 'meal-plan-draft',
  RECIPE_DRAFTS: 'recipe-drafts',
  SHOPPING_LIST: 'shopping-list',
  THEME: 'theme-preference',
  ANALYTICS_CONSENT: 'analytics-consent'
} as const;

// Helper functions for local storage management
const clearUserData = () => {
  // Clear user-specific data but keep theme and analytics consent
  const themePreference = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
  const analyticsConsent = localStorage.getItem(LOCAL_STORAGE_KEYS.ANALYTICS_CONSENT);
  
  localStorage.clear();
  
  // Restore non-user-specific preferences
  if (themePreference) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, themePreference);
  }
  if (analyticsConsent) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ANALYTICS_CONSENT, analyticsConsent);
  }
};

const initializeUserData = (userId: string) => {
  // Initialize default user preferences if they don't exist
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.PREFERENCES)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PREFERENCES, JSON.stringify({
      userId,
      dietaryRestrictions: [],
      cuisinePreferences: [],
      servingSize: 2,
      cookingLevel: 'intermediate'
    }));
  }

  // Initialize empty shopping list if it doesn't exist
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.SHOPPING_LIST)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SHOPPING_LIST, JSON.stringify({
      userId,
      items: [],
      lastUpdated: new Date().toISOString()
    }));
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialSession, setIsInitialSession] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    location.pathname.startsWith(route)
  );

  useEffect(() => {
    // Redirect from protected routes when not authenticated
    if (!loading && !user && isProtectedRoute) {
      navigate('/', { replace: true });
    }
  }, [user, loading, isProtectedRoute, navigate]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Initialize user data if logged in
      if (session?.user) {
        const provider = session.user.app_metadata?.provider || 'email';
        const userId = session.user.id;
        
        initializeUserData(userId);
        
        // Only track if this is a new signup (no last_sign_in_at)
        if (!session.user.last_sign_in_at) {
          dataLayer.trackUserSignup(provider, userId);
        }
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      const previousUser = user;
      setUser(session?.user ?? null);
      setLoading(false);

      // Skip tracking for the initial session
      if (isInitialSession) {
        setIsInitialSession(false);
        return;
      }

      // Track auth events
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            const provider = session.user.app_metadata?.provider || 'email';
            const userId = session.user.id;
            
            // Initialize user data
            initializeUserData(userId);
            
            // If this is the first sign in (no last_sign_in_at), it's a new signup
            if (!session.user.last_sign_in_at) {
              dataLayer.trackUserSignup(provider, userId);
            }
            // Track login event
            dataLayer.trackUserLogin(provider, userId);
          }
          break;
        case 'SIGNED_OUT':
          // Clear user data from local storage
          clearUserData();
          
          // Track logout event using the previous user's ID if available
          if (previousUser) {
            dataLayer.trackUserLogout(previousUser.id);
          }

          // Redirect to home page if on a protected route
          if (isProtectedRoute) {
            navigate('/', { replace: true });
          }
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, isInitialSession, navigate, isProtectedRoute]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 