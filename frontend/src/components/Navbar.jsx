import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiLayout, FiHeart } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'hospital') return '/hospital/dashboard';
    return '/donor/dashboard';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                Blood<span className="text-brand-600">Connect</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 tracking-wider uppercase mt-0.5">
                Save Lives Today
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-1 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'text-brand-600 after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2.5px] after:bg-brand-600 after:rounded-full'
                      : 'text-slate-600 hover:text-brand-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200 transition-colors"
                >
                  <FiLayout className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <div className="h-6 w-px bg-slate-200"></div>

                <div className="flex items-center gap-2">
                  <img
                    src={user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-brand-500 object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize">{user.role}</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-all duration-200 active:scale-95"
                >
                  <FiHeart className="w-4 h-4" />
                  <span>Become a Donor</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded-lg"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 font-semibold text-brand-700 bg-brand-50 rounded-lg"
                >
                  Go to {user.role.toUpperCase()} Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2.5 font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 font-semibold text-slate-700 border border-slate-300 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 font-semibold text-white bg-brand-600 rounded-lg shadow-sm"
                >
                  Become a Donor
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
