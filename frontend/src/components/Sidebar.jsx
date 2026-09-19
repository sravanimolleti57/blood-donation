import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TiltCard from './ui/TiltCard';
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
    <aside className="w-64 bg-slate-900/95 backdrop-blur-xl text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shrink-0 shadow-2xl border-r border-slate-800/80 rounded-2xl relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-600/10 to-transparent pointer-events-none"></div>

      <div className="space-y-6 relative z-10">
        
        {/* Donor Profile Card with 3D Tilt, Avatar Scale 1.05 & Crimson Glow */}
        <TiltCard
          maxAngle={5}
          scaleOnHover={1.02}
          className="bg-slate-800/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/80 shadow-md hover:border-red-500/50 hover:shadow-red-950/40 transition-all duration-300 relative overflow-hidden group/profile"
        >
          {/* Subtle floating particles around avatar */}
          <div className="absolute -top-3 -right-3 w-16 h-16 bg-red-500/10 rounded-full blur-md group-hover/profile:scale-150 transition-transform"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="relative group/avatar shrink-0">
              {/* Soft Crimson Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-500 rounded-full blur-xs opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300"></div>
              <img
                src={user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={user.name}
                className="relative w-11 h-11 rounded-full border-2 border-red-500 object-cover transform group-hover/avatar:scale-[1.05] transition-transform duration-300 shadow-md"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate">{user.name}</span>
              <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1">
                <FiShield className="w-3 h-3 text-red-400" />
                {user.role}
              </span>
            </div>
          </div>
        </TiltCard>

        {/* Navigation Section Header */}
        <div>
          <h3 className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">
            {user.role} Navigation
          </h3>
          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 via-rose-600 to-brand-600 text-white font-bold shadow-lg shadow-red-950/50'
                        : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Left Red Accent Bar */}
                      <span
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full bg-red-500 transition-all duration-200 ${
                          isActive
                            ? 'opacity-100 shadow-sm shadow-red-500'
                            : 'opacity-0 group-hover:opacity-100 group-hover:h-4'
                        }`}
                      ></span>

                      {/* Icon with 3px movement */}
                      <Icon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:translate-x-[3px]" />
                      
                      {/* Text with 2px movement */}
                      <span className="transition-transform duration-200 group-hover:translate-x-[2px]">
                        {link.name}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-slate-800/80 relative z-10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all duration-200 group"
        >
          <FiLogOut className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
