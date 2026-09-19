import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  FiUsers,
  FiActivity,
  FiDroplet,
  FiCheckCircle,
  FiShield,
  FiTrendingUp,
  FiAlertCircle,
  FiClock,
  FiCheckSquare,
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalHospitals: 0,
    totalAdmins: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalBloodRequests: 0,
    pendingBloodRequests: 0,
    fulfilledBloodRequests: 0,
    totalDonations: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      setLoading(true);
      try {
        const [statsRes, usersRes] = await Promise.all([
          API.get('/admin/dashboard/stats'),
          API.get('/admin/users'),
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }

        if (usersRes.data.success) {
          const userList = usersRes.data.users || usersRes.data.data || [];
          setRecentUsers(userList.slice(0, 5));
        }
      } catch (err) {
        console.error('Error loading admin dashboard stats:', err);
        setError('Failed to fetch dashboard metrics from MongoDB Atlas.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner Greeting */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold">System Administration Panel</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
              LIVE MONGODB METRICS
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time management of registered donors, hospital accounts, and emergency blood request pipeline.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-red-400 flex items-center justify-center text-2xl border border-slate-700">
          🛡️
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-3">
          <FiAlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FiUsers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {loading ? '...' : stats.totalUsers}
          </div>
          <p className="text-[11px] text-slate-500">
            {stats.activeUsers} Active • {stats.inactiveUsers} Deactivated
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Donors</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <FiDroplet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {loading ? '...' : stats.totalDonors}
          </div>
          <p className="text-[11px] text-slate-500">Available blood donors</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hospitals / Banks</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiActivity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {loading ? '...' : stats.totalHospitals}
          </div>
          <p className="text-[11px] text-slate-500">Partner medical accounts</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blood Requests</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FiClock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {loading ? '...' : stats.totalBloodRequests}
          </div>
          <p className="text-[11px] text-amber-600 font-medium">
            {stats.pendingBloodRequests} Pending Approval
          </p>
        </div>
      </div>

      {/* Secondary Metrics & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Additional Stats Breakdown */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Platform Operational Breakdown</h2>
              <p className="text-xs text-slate-500">Database statistics direct from MongoDB Atlas</p>
            </div>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
              Live Connection
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Fulfilled Requests</span>
              <div className="text-2xl font-bold text-emerald-600">{stats.fulfilledBloodRequests}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Completed Donations</span>
              <div className="text-2xl font-bold text-blue-600">{stats.totalDonations}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-xs text-slate-500 font-medium">System Administrators</span>
              <div className="text-2xl font-bold text-purple-600">{stats.totalAdmins}</div>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white space-y-2">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <FiShield className="text-red-400" />
              Role-Based Access Control Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Administrators have full operational control to review user accounts, approve emergency blood requests, verify hospital licenses, and manage donor availability status across the system.
            </p>
          </div>
        </div>

        {/* Recent Registrations Table/List */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4">Recent Registrations</h2>
          
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading user list...</div>
          ) : recentUsers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">No registered users found.</div>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div key={u._id || u.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="min-w-0 flex-1 pr-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{u.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : u.role === 'hospital'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
