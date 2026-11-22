import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const authRequestId = useRef(0);

  const checkUserAuth = useCallback(async () => {
    const requestId = ++authRequestId.current;
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const currentUser = await base44.auth.me();
      if (requestId === authRequestId.current) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      return currentUser;
    } catch (error) {
      if (requestId === authRequestId.current) {
        setUser(null);
        setIsAuthenticated(false);
        setAuthError(null);
      }
      return null;
    } finally {
      if (requestId === authRequestId.current) {
        setIsLoadingAuth(false);
        setAuthChecked(true);
      }
    }
  }, []);

  useEffect(() => { checkUserAuth(); }, [checkUserAuth]);
  const logout = (shouldRedirect = true) => {
    authRequestId.current += 1;
    base44.auth.logout();
    setUser(null);
    setIsAuthenticated(false);
    setAuthChecked(true);
    setIsLoadingAuth(false);
    if (shouldRedirect) window.location.href = '/login';
  };
  const navigateToLogin = () => { window.location.href = '/login'; };
  return <AuthContext.Provider value={{ user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError, appPublicSettings: null, authChecked, logout, navigateToLogin, checkUserAuth, checkAppState: checkUserAuth }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => { const c = useContext(AuthContext); if (!c) throw new Error('useAuth must be used within an AuthProvider'); return c; };
