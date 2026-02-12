import React from 'react';
import { User } from '../types';
import { api } from '../services/api';

type AuthContextValue = {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): User | null {
  const raw = localStorage.getItem('rentify_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, _setUser] = React.useState<User | null>(() => readStoredUser());

  const setUser = (u: User | null) => {
    _setUser(u);
    if (u) localStorage.setItem('rentify_user', JSON.stringify(u));
    else localStorage.removeItem('rentify_user');
  };

  const logout = () => setUser(null);

  const refreshProfile = async () => {
    const current = readStoredUser();
    if (!current?.token) return;
    try {
      const profile = await api.users.me();
      setUser({ ...profile, token: current.token });
    } catch {
      // token expired or invalid
      setUser(null);
    }
  };

  // Keep header/profile synced after login/logout without page refresh
  React.useEffect(() => {
    // When app loads, try to refresh profile (optional)
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
