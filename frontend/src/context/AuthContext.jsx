import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.message };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (googleUser) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google-login', {
        email: googleUser.email,
        fullName: googleUser.name,
        avatarUrl: googleUser.picture,
      });
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', registerData);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, code) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, code });
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.success && res.data) {
        setUser(res.data);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'Admin' || user?.role === 3;
  const isTrainer = user?.role === 'Trainer' || user?.role === 2;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isAdmin,
        isTrainer,
        login,
        googleLogin,
        register,
        verifyOtp,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
