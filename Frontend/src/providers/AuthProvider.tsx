import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import apiClient from "@/lib/api-client";
import {
  clearStoredAuth,
  getStoredAuth,
  persistAuth,
} from "@/lib/auth-storage";
import type { ApiSuccessResponse } from "@/types/api";
import type { AuthTokenResponse, AuthUser } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (data: AuthTokenResponse) => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedAuth = getStoredAuth();
  const [user, setUser] = useState<AuthUser | null>(storedAuth.user);
  const [isLoading, setIsLoading] = useState(Boolean(storedAuth.accessToken));

  const setSession = useCallback((data: AuthTokenResponse) => {
    const authState = persistAuth(data);
    setUser(authState.user);
  }, []);

  const clearSession = useCallback(() => {
    clearStoredAuth();
    setUser(null);
  }, []);

  useEffect(() => {
    const { accessToken } = getStoredAuth();

    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function validateSession() {
      try {
        const response = await apiClient.get<ApiSuccessResponse<AuthUser>>(
          "/api/auth/me"
        );

        if (!isMounted) {
          return;
        }

        if (response.data.success && response.data.data) {
          setUser(response.data.data);
        } else {
          clearSession();
        }
      } catch {
        if (isMounted) {
          clearSession();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void validateSession();

    return () => {
      isMounted = false;
    };
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      setSession,
      clearSession,
    }),
    [clearSession, isLoading, setSession, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
