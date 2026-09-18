import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import {
  FiUsers,
  FiActivity,
  FiDroplet,
  FiCheckCircle,
  FiShield,
  FiTrendingUp,
  FiAlertCircle,
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 1240,
    totalDonors: 1050,
    totalHospitals: 190,
    activeRequests: 42,
  });

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const usersRes = await API.get('/users');
        const hospitalsRes = await API.get('/users/hospitals');
        if (usersRes.data.success) {
          const allUsers = usersRes.data.users;
          const donors = allUsers.filter((u) => u.role === 'donor');
          setStats({
            totalUsers: allUsers.length,
            totalDonors: donors.length,
            totalHospitals: hospitalsRes.data.count || 0,
            activeRequests: 12,
          });
        }
      } catch (err) {
        console.log('Using admin dashboard fallback counters');
      }
    };
    fetchAdminStats();
  }, []);

  const recentUsers = [
    { name: 'Ananya Roy', email: 'ananya@example.com', role: 'donor', date: 'Today', status: 'Active' },
    { name: 'City Hospital Hub', email: 'contact@cityhosp.org', role: 'hospital', date: 'Yesterday', status: 'Pending' },
    { name: 'Rahul Sharma', email: 'rahul@example.com', role: 'donor', date: '16 Sep', status: 'Active' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Banner Greeting */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold">System Administration Panel</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-600 text-white uppercase tracking-wider">
              ADMIN CONTROL
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time monitoring of registered donors, hospital verification, and network health.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-brand-400 flex items-center justify-center text-2xl border border-slate-700">
          🛡️
        </div>
      </div>

      {/* Platform Overview Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FiUsers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalUsers}</div>
          <p className="text-[11px] text-emerald-600 font-medium">+14% growth this month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Donors</span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <FiDroplet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalDonors}</div>
          <p className="text-[11px] text-slate-400">Registered donor base</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Hospitals</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiActivity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalHospitals}</div>
          <p className="text-[11px] text-slate-400">Partner medical facilities</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Requests</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.activeRequests}</div>
          <p className="text-[11px] text-brand-600 font-medium">Live emergency needs</p>
        </div>

      </div>

      {/* Chart Placeholder & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Analytics Visual Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Donation & Registration Analytics</h2>
              <p className="text-xs text-slate-500">Monthly platform volume trends</p>
            </div>
            <span className="text-xs text-brand-600 font-semibold bg-brand-50 px-2.5 py-1 rounded-full">
              2026 Metrics
            </span>
          </div>

          <div className="h-48 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center flex-col gap-2">
            <FiTrendingUp className="w-8 h-8 text-slate-400 animate-bounce" />
            <span className="text-xs font-bold text-slate-600">Platform Activity Chart Placeholder</span>
            <span className="text-[11px] text-slate-400">Monthly donor registrations & requests matched</span>
          </div>
        </div>

        {/* Quick Audit Logs */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b pb-3">Recent Registrations</h2>
          <div className="space-y-3">
            {recentUsers.map((u, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{u.name}</h4>
                  <p className="text-[10px] text-slate-400">{u.email}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {u.role.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
