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

      // Track auth events
      switch (event) {
        case 'INITIAL_SESSION':
          dataLayer.trackUserLogin(
            session?.user?.app_metadata?.provider || 'email',
            session?.user?.id
          );
          break;
        case 'SIGNED_IN':
          if (!session?.user?.last_sign_in_at) {
            // This is a new signup
            dataLayer.trackUserSignup(
              session?.user?.app_metadata?.provider || 'email',
              session?.user?.id
            );
          } else {
            // This is a login
            dataLayer.trackUserLogin(
              session?.user?.app_metadata?.provider || 'email',
              session?.user?.id
            );
          }
          break;
        case 'SIGNED_OUT':
          dataLayer.trackUserLogout(session?.user?.id);
          break;
        case 'USER_UPDATED':
          dataLayer.trackUserLogin(
            session?.user?.app_metadata?.provider || 'email',
            session?.user?.id
          );
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