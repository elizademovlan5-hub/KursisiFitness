import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Dumbbell,
  Calendar,
  Layers,
  Calculator,
  Camera,
  History,
  ShieldAlert,
  User as UserIcon,
  LogOut,
  Globe,
  Menu,
  X,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/exercises', label: t('nav_exercises'), icon: Dumbbell },
    { to: '/weekly-plan', label: t('nav_weekly_plan'), icon: Calendar, auth: true },
    { to: '/packages', label: t('nav_packages'), icon: Layers },
    { to: '/calculator', label: t('nav_calculator'), icon: Calculator },
    { to: '/progress', label: t('nav_progress'), icon: Camera, auth: true },
    { to: '/history', label: t('nav_history'), icon: History, auth: true },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Kursisi<span className="text-emerald-400">.Fit</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                Gym & Workout Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.auth && !isAuthenticated) return null;
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'text-rose-400 hover:bg-rose-500/10'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                {t('nav_admin')}
              </Link>
            )}
          </div>

          {/* Right Controls: Language Switcher & User Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Dili dəyiş / Switch language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang}</span>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-800 transition-colors border border-slate-700"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/50"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-200 pr-2">
                    {user?.fullName?.split(' ')[0]}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-700/60">
                      <p className="text-xs text-slate-400">Daxil olub:</p>
                      <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
                      <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300">
                        {user?.roleName || user?.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-400" />
                      {t('nav_profile')}
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-slate-700/60 transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        {t('nav_admin')}
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('nav_logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {t('nav_login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                >
                  {t('nav_register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 text-xs font-bold uppercase rounded border border-slate-700 text-slate-300"
            >
              {lang}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            if (link.auth && !isAuthenticated) return null;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                {link.label}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-slate-800"
            >
              <ShieldAlert className="w-4 h-4" />
              {t('nav_admin')}
            </Link>
          )}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-200"
                >
                  <UserIcon className="w-4 h-4 text-emerald-400" />
                  {t('nav_profile')} ({user?.fullName})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-rose-400 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav_logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-slate-300 bg-slate-800 rounded-lg"
                >
                  {t('nav_login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg"
                >
                  {t('nav_register')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
