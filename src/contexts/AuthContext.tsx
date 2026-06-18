import React, { useEffect, useState, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase'; // Sesuaikan path menuju file instansiasi supabase kamu

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Cek sesi aktif yang tersimpan di cloud session saat aplikasi pertama kali dimuat
    const getActiveSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.name || '',
          email: session.user.email || '',
        });
      }
      setIsLoading(false);
    };

    getActiveSession();

    // 2. Dengarkan perubahan status otentikasi secara global (misal: login, logout, dsb)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.name || '',
          email: session.user.email || '',
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // REGISTER KE CLOUD DATABASE
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name, // Menyimpan display name ke dalam user_metadata di database cloud
          },
        },
      });

      if (error) {
        console.error('Supabase Register Error:', error.message);
        return false;
      }

      return !!data.user;
    } catch (err) {
      console.error('Unexpected register error:', err);
      return false;
    }
  };

  // LOGIN KE CLOUD DATABASE
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase Login Error:', error.message);
        return false;
      }

      return !!data.user;
    } catch (err) {
      console.error('Unexpected login error:', err);
      return false;
    }
  };

  // LOGOUT DARI CLOUD
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}