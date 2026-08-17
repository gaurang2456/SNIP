import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('snip_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('snip_token') || null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register' | 'prompt'
  const [promptContext, setPromptContext] = useState('urls'); // 'urls' | 'analytics'

  useEffect(() => {
    if (token) {
      localStorage.setItem('snip_token', token);
    } else {
      localStorage.removeItem('snip_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('snip_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('snip_user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      const data = res.data?.data || res.data;
      const newToken = data.token;
      const userInfo = { email: data.email, id: data.id };

      setToken(newToken);
      setUser(userInfo);
      setIsAuthModalOpen(false);
      toast.success('Signed in successfully!');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
      return false;
    }
  };

  const register = async (email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    try {
      const res = await authApi.register({ email, password, confirmPassword });
      const data = res.data?.data || res.data;
      const newToken = data.token;
      const userInfo = { email: data.email, id: data.id };

      setToken(newToken);
      setUser(userInfo);
      setIsAuthModalOpen(false);
      toast.success('Account created successfully!');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('snip_token');
    localStorage.removeItem('snip_user');
    toast.success('Signed out');
  };

  const openAuthModal = (mode = 'login', context = 'urls') => {
    setAuthModalMode(mode);
    setPromptContext(context);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalMode,
        promptContext,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
