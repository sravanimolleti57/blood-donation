import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import {
  FiUsers,
  FiActivity,
  FiDroplet,
  FiCheckCircle,
  FiShield,
  FiAlertCircle,
  FiClock,
  FiHeart,
  FiUserCheck,
  FiUserX,
  FiCheckSquare,
  FiArrowRight,
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalHospitals: 0,
    totalAdmins: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    activeDonors: 0,
    inactiveDonors: 0,
    activeHospitals: 0,
    inactiveHospitals: 0,
    totalBloodRequests: 0,
    activeBloodRequests: 0,
    pendingBloodRequests: 0,
    approvedBloodRequests: 0,
    fulfilledBloodRequests: 0,
    pendingDonorResponses: 0,
    acceptedResponses: 0,
    rejectedResponses: 0,
    totalDonations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminService.getDashboardStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Error loading admin dashboard stats:', err);
        setError('Unable to load live dashboard statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner Greeting */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex items-center justify-between border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">System Administration Portal</h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white uppercase tracking-wider shadow-xs">
              LIVE MONGODB DATA
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Real-time management portal for donor accounts, hospital oversight, admin verification, and blood request fulfillment.
          </p>
        </div>
        <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-slate-800 text-red-500 items-center justify-center text-3xl border border-slate-700 shadow-inner shrink-0">
          🛡️
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-3">
          <FiAlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* THREE MAIN PORTAL NAVIGATION BUTTONS / CARDS */}
      {/* ============================================================ */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
          Core Management Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. DONOR MANAGEMENT */}
          <Link
            to="/admin/donors"
            className="group p-6 bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-3xl shadow-md hover:shadow-xl transition-all border border-red-500/30 flex flex-col justify-between space-y-4 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center text-2xl backdrop-blur-xs border border-white/20">
                🩸
              </div>
              <span className="text-xs font-extrabold bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
                {stats.totalDonors} Accounts
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black tracking-tight">DONOR MANAGEMENT</h3>
              <p className="text-xs text-red-100 mt-1 leading-relaxed">
                Review donor profiles, verify pending responses, and manage account statuses.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-white/10">
              <span>Open Donor Directory</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 2. HOSPITAL MANAGEMENT */}
          <Link
            to="/admin/hospitals"
            className="group p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl shadow-md hover:shadow-xl transition-all border border-slate-700/60 flex flex-col justify-between space-y-4 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center text-2xl backdrop-blur-xs border border-white/20">
                🏥
              </div>
              <span className="text-xs font-extrabold bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
                {stats.totalHospitals} Facilities
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black tracking-tight">HOSPITAL MANAGEMENT</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Verify hospital license numbers, monitor request statistics, and manage hospital accounts.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-white/10">
              <span>Open Hospital Directory</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 3. ADMIN MANAGEMENT */}
          <Link
            to="/admin/management"
            className="group p-6 bg-gradient-to-br from-purple-700 to-indigo-800 text-white rounded-3xl shadow-md hover:shadow-xl transition-all border border-purple-500/30 flex flex-col justify-between space-y-4 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center text-2xl backdrop-blur-xs border border-white/20">
                🛡️
              </div>
              <span className="text-xs font-extrabold bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
                {stats.totalAdmins} Admins
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black tracking-tight">ADMIN MANAGEMENT</h3>
              <p className="text-xs text-purple-100 mt-1 leading-relaxed">
                Oversee system administrators, role-based access permissions, and security audit logs.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-white/10">
              <span>Open Admin Accounts</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
          Database Statistics & Activity Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {/* Total Donors */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Donors</span>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <FiHeart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{loading ? '...' : stats.totalDonors}</div>
            <p className="text-[11px] text-slate-500">{stats.activeDonors} Active • {stats.inactiveDonors} Inactive</p>
          </div>

          {/* Total Hospitals */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Hospitals</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FiActivity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{loading ? '...' : stats.totalHospitals}</div>
            <p className="text-[11px] text-slate-500">{stats.activeHospitals} Active • {stats.inactiveHospitals} Inactive</p>
          </div>

          {/* Total Admins */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Admins</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FiShield className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{loading ? '...' : stats.totalAdmins}</div>
            <p className="text-[11px] text-slate-500">System Administrators</p>
          </div>

          {/* Active Blood Requests */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Requests</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FiDroplet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{loading ? '...' : (stats.activeBloodRequests || stats.pendingBloodRequests)}</div>
            <p className="text-[11px] text-amber-600 font-bold">Seeking donors</p>
          </div>

          {/* Pending Donor Responses */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Responses</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FiClock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{loading ? '...' : stats.pendingDonorResponses}</div>
            <p className="text-[11px] text-amber-600 font-bold">Awaiting Admin review</p>
          </div>

          {/* Accepted Responses */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Accepted Responses</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FiUserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{loading ? '...' : stats.acceptedResponses}</div>
            <p className="text-[11px] text-emerald-600 font-bold">Verified & fulfilled</p>
          </div>

          {/* Rejected Responses */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rejected Responses</span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <FiUserX className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{loading ? '...' : stats.rejectedResponses}</div>
            <p className="text-[11px] text-rose-600 font-bold">Ineligible responses</p>
          </div>

          {/* Fulfilled Requests */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fulfilled Requests</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FiCheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{loading ? '...' : (stats.fulfilledRequests || stats.fulfilledBloodRequests)}</div>
            <p className="text-[11px] text-emerald-600 font-bold">Closed requests</p>
          </div>

          {/* Total Donations */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Donations</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FiCheckSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">{loading ? '...' : stats.totalDonations}</div>
            <p className="text-[11px] text-slate-500 font-medium">Logged contributions</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
