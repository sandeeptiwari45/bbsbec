import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, User } from '../types';
import { MockService } from '../services/mockService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: any, code: string, allowedRoles?: Role[]) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    MockService.initialize();
    const storedUser = localStorage.getItem('bbsbec_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await MockService.login(email, password);
      setUser(loggedUser);
      localStorage.setItem('bbsbec_current_user', JSON.stringify(loggedUser));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any, code: string, allowedRoles: Role[] = ['student', 'faculty', 'admin']) => {
    setIsLoading(true);
    try {
      await MockService.register(data, code, allowedRoles);
      // We don't auto login after register if approval is needed, 
      // but for this demo flow we might expect the user to go to login.
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bbsbec_current_user');
    window.location.hash = '#/login';
  };

  const updateUser = (u: User) => {
    setUser(u);
    localStorage.setItem('bbsbec_current_user', JSON.stringify(u));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
