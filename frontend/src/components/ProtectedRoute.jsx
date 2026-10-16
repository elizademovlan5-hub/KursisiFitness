import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roleRequired }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roleRequired) {
    const userRoleStr = (user?.roleName || user?.role || '').toString();
    const hasRole = Array.isArray(roleRequired)
      ? roleRequired.some((r) => r.toLowerCase() === userRoleStr.toLowerCase())
      : roleRequired.toLowerCase() === userRoleStr.toLowerCase();

    if (!hasRole) {
      return (
        <div className="max-w-md mx-auto my-16 p-6 bg-slate-900 border border-rose-500/30 rounded-2xl text-center">
          <h2 className="text-xl font-bold text-rose-400 mb-2">Giriş Məhdudlaşdırılıb</h2>
          <p className="text-sm text-slate-400 mb-4">
            Bu səhifəyə daxil olmaq üçün tələb olunan səlahiyyətiniz ({Array.isArray(roleRequired) ? roleRequired.join(', ') : roleRequired}) yoxdur.
          </p>
          <Navigate to="/" replace />
        </div>
      );
    }
  }

  return children;
}
