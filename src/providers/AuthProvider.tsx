import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { dataLayer } from '@/services/dataLayer';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialSession, setIsInitialSession] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Don't track initial session as a new login
      if (session?.user) {
        const provider = session.user.app_metadata?.provider || 'email';
        const userId = session.user.id;
        
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
            
            // If this is the first sign in (no last_sign_in_at), it's a new signup
            if (!session.user.last_sign_in_at) {
              dataLayer.trackUserSignup(provider, userId);
            }
            // Track login event
            dataLayer.trackUserLogin(provider, userId);
          }
          break;
        case 'SIGNED_OUT':
          // Track logout event using the previous user's ID if available
          if (previousUser) {
            dataLayer.trackUserLogout(previousUser.id);
          }
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, isInitialSession]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 