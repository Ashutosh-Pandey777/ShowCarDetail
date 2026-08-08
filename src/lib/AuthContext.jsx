import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true); setAuthError(null);
    try { const u = await base44.auth.me(); setUser(u); setIsAuthenticated(true); }
    catch { setUser(null); setIsAuthenticated(false); }
    finally { setIsLoadingAuth(false); setAuthChecked(true); }
  }, []);

  useEffect(() => { checkUserAuth(); }, [checkUserAuth]);
  const logout = (shouldRedirect = true) => { base44.auth.logout(); setUser(null); setIsAuthenticated(false); setAuthChecked(true); if (shouldRedirect) window.location.href = '/login'; };
  const navigateToLogin = () => { window.location.href = '/login'; };
  return <AuthContext.Provider value={{ user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError, appPublicSettings: null, authChecked, logout, navigateToLogin, checkUserAuth, checkAppState: checkUserAuth }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => { const c = useContext(AuthContext); if (!c) throw new Error('useAuth must be used within an AuthProvider'); return c; };
