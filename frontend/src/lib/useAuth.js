'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from './api';
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (authAPI.isAuthenticated()) {
        const currentUser = authAPI.getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);
  useEffect(() => {
    const handleAuthChanged = (e) => {
      if (e && e.detail) {
        setUser(e.detail);
      } else {
        if (authAPI.isAuthenticated()) {
          setUser(authAPI.getCurrentUser());
        } else {
          setUser(null);
        }
      }
    };
    const handleStorage = (e) => {
      if (["accessToken", "refreshToken", "username", "role"].includes(e.key)) {
        if (authAPI.isAuthenticated()) setUser(authAPI.getCurrentUser());
        else setUser(null);
      }
    };
    window.addEventListener('authChanged', handleAuthChanged);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('authChanged', handleAuthChanged);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);
  const refreshAuth = () => {
    if (authAPI.isAuthenticated()) {
      setUser(authAPI.getCurrentUser());
    } else {
      setUser(null);
    }
  };
  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      router.push('/sign-in/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      setUser(null);
      router.push('/sign-in/login');
    }
  };

  return { user, loading, logout, refreshAuth };
};

// Protected route wrapper
export const useProtectedRoute = (allowedRoles = []) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/sign-in/login');
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.push('/'); // Redirect to home if role not allowed
      }
    }
  }, [user, loading, router, allowedRoles]);

  return { user, loading };
};
