import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { User, createBasicUser } from '../../types/user';

// Define the shape of our Auth Context
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ user: any | null; error: string | null }>;
  logout: () => Promise<{ error: string | null }>;
}

// Create the Auth Context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => ({ user: null, error: 'Not implemented' }),
  logout: async () => ({ error: 'Not implemented' }),
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only register auth listener once
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, Boolean(session));
        
        if (session?.user) {
          try {
            // Create a basic user from session
            setUser(createBasicUser(
              session.user.id,
              session.user.email || '',
              'client'
            ));
          } catch (err) {
            console.error('Failed to process authentication:', err);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          try {
            // Create a basic user from session
            setUser(createBasicUser(
              session.user.id,
              session.user.email || '',
              'client'
            ));
          } catch (err) {
            console.error('Failed to process authentication:', err);
            setUser(null);
          }
        }
        
        // Set loading to false regardless of outcome
        setLoading(false);
      } catch (err) {
        console.error('Authentication initialization error:', err);
        setError('Failed to initialize authentication');
        setLoading(false);
      }
    };

    // Initialize auth on component mount
    initializeAuth();

    // Cleanup auth listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Authentication methods
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      return { user: null, error: error.message || 'Failed to login' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      return { error: null };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { error: error.message || 'Failed to logout' };
    } finally {
      setLoading(false);
    }
  };

  // Provide auth context to children
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext); 