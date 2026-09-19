import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid,
  FiUser,
  FiClock,
  FiFilePlus,
  FiList,
  FiUsers,
  FiActivity,
  FiSettings,
  FiLogOut,
  FiDroplet,
  FiShield,
  FiHeart,
  FiCheckSquare,
} from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const donorLinks = [
    { name: 'Dashboard', path: '/donor/dashboard', icon: FiGrid },
    { name: 'Blood Requests', path: '/donor/requests', icon: FiDroplet },
    { name: 'Donation History', path: '/donor/history', icon: FiClock },
    { name: 'My Profile', path: '/donor/profile', icon: FiUser },
  ];

  const hospitalLinks = [
    { name: 'Dashboard', path: '/hospital/dashboard', icon: FiGrid },
    { name: 'Create Request', path: '/hospital/create-request', icon: FiFilePlus },
    { name: 'Hospital Requests', path: '/hospital/requests', icon: FiList },
    { name: 'Hospital Profile', path: '/hospital/profile', icon: FiUser },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
    { name: 'Users', path: '/admin/users', icon: FiUsers },
    { name: 'Donors', path: '/admin/donors', icon: FiHeart },
    { name: 'Hospitals', path: '/admin/hospitals', icon: FiActivity },
    { name: 'Admins', path: '/admin/management', icon: FiShield },
    { name: 'Blood Requests', path: '/admin/requests', icon: FiDroplet },
    { name: 'Donations', path: '/admin/donations', icon: FiCheckSquare },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  const links =
    user.role === 'admin'
      ? adminLinks
      : user.role === 'hospital'
      ? hospitalLinks
      : donorLinks;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shrink-0 shadow-xl border-r border-slate-800 rounded-2xl">
      <div className="space-y-6">
        {/* User Mini Card */}
        <div className="flex items-center gap-3 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
          <img
            src={user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-red-500 object-cover shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white truncate">{user.name}</span>
            <span className="text-[11px] font-medium text-red-400 uppercase tracking-wider flex items-center gap-1">
              <FiShield className="w-3 h-3" />
              {user.role}
            </span>
          </div>
        </div>

        {/* Navigation Section Header */}
        <div>
          <h3 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {user.role} Navigation
          </h3>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-red-600 text-white font-semibold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
