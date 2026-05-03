import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

function parseToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('tm_token') || localStorage.getItem('token');
    if (!token) return null;
    return parseToken(token);
  });

  const login = useCallback((token) => {
    localStorage.setItem('tm_token', token);
    const parsedUser = parseToken(token);
    localStorage.setItem('token', token);
    if (parsedUser) localStorage.setItem('user', JSON.stringify(parsedUser));
    setUser(parsedUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tm_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAdmin: user?.role === 'Admin' }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
