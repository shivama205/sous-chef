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

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (!session?.user) return;

      const provider = session.user.app_metadata?.provider || 'email';
      const userId = session.user.id;

      // Track auth events
      switch (event) {
        case 'SIGNED_IN':
          // If this is the first sign in (no last_sign_in_at), it's a new signup
          if (!session.user.last_sign_in_at) {
            dataLayer.trackUserSignup(provider, userId);
          }
          // Track login event for both initial and subsequent sign-ins
          dataLayer.trackUserLogin(provider, userId);
          break;
        case 'SIGNED_OUT':
          // Track logout event
          dataLayer.trackUserLogout(userId);
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 