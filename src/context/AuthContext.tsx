import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/authApi';
import type { AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: AuthUser, token?: string) => void;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const STORAGE_KEY = 'samagri-admin-session';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const session = sessionStorage.getItem(STORAGE_KEY);
        if (!session) {
          setUserState(null);
          setIsLoading(false);
          return;
        }

        const parsed = JSON.parse(session) as { user?: AuthUser; token?: string };
        if (parsed.user) {
          setUserState(parsed.user);
          return;
        }

        const currentUser = await authApi.getCurrentUser();
        if (currentUser) {
          setUserState(currentUser);
        }
      } catch {
        setUserState(null);
        sessionStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    void init();
  }, []);

  const login = (nextUser: AuthUser, token?: string) => {
    setUserState(nextUser);
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: nextUser,
        token,
      }),
    );
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore server-side logout errors and clear local auth state
    } finally {
      setUserState(null);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      setUser: setUserState,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
