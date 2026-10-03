import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/api.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    authApi.me().then(setUser).catch(() => setUser(null)).finally(() => setReady(true));
    const onUnauthorized = () => setUser(null);
    window.addEventListener('admin:unauthorized', onUnauthorized);
    return () => window.removeEventListener('admin:unauthorized', onUnauthorized);
  }, []);

  const login = useCallback(async (username, password) => setUser(await authApi.login(username, password)), []);
  const logout = useCallback(async () => { await authApi.logout().catch(() => {}); setUser(null); }, []);

  const value = useMemo(() => ({ user, ready, login, logout }), [user, ready, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}