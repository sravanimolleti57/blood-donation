import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import API from '../../services/api';
import {
  FiHeart,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiDroplet,
  FiUser,
  FiList,
  FiActivity,
  FiRefreshCw,
} from 'react-icons/fi';

const DonorDashboard = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const toggleAvailability = async () => {
    setLoading(true);
    try {
      const newStatus = !user?.available;
      const { data } = await API.put('/users/availability', { available: newStatus });
      setLoading(false);

      if (data.success) {
        updateUser({ available: data.available });
        setToast({
          type: 'success',
          message: data.message || `Availability updated to ${data.available ? 'AVAILABLE' : 'UNAVAILABLE'}`,
        });
      }
    } catch (error) {
      setLoading(false);
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update availability status',
      });
    }
  };

  const recentActivities = [
    { id: 1, date: '2026-08-15', type: 'Donation Completed', location: 'City Central Blood Bank', status: 'Completed', color: 'emerald' },
    { id: 2, date: '2026-05-10', type: 'Donation Completed', location: 'Apollo Hospital Hub', status: 'Completed', color: 'emerald' },
    { id: 3, date: '2026-02-14', type: 'Donation Completed', location: 'St. Jude Medical Center', status: 'Completed', color: 'emerald' },
  ];

  return (
    <div className="space-y-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Top Banner Greeting */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Welcome back, {user?.name || 'Donor'}! 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Your contribution can help save lives. Keep your availability updated for emergency alerts.
          </p>
        </div>

        {/* Quick Availability Card / Button */}
        <div className="w-full md:w-auto p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${user?.available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Status</span>
              <span className={`text-xs font-bold ${user?.available ? 'text-emerald-700' : 'text-slate-600'}`}>
                {user?.available ? 'AVAILABLE TO DONATE' : 'UNAVAILABLE'}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant={user?.available ? 'secondary' : 'primary'}
            onClick={toggleAvailability}
            loading={loading}
            icon={FiRefreshCw}
          >
            {user?.available ? 'Set Unavailable' : 'Set Available'}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Donations</span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <FiHeart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">12</div>
          <p className="text-[11px] text-slate-400">Verified platform records</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Donation</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiClock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">Aug 15</div>
          <p className="text-[11px] text-emerald-600 font-medium">Eligible to donate again</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blood Group</span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <FiDroplet className="w-5 h-5" />
            </div>
          </div>
          <div className="pt-1">
            <BloodGroupBadge bloodGroup={user?.bloodGroup || 'O+'} size="lg" />
          </div>
          <p className="text-[11px] text-slate-400">Universal donor profile</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Availability</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${user?.available ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
              {user?.available ? <FiCheckCircle className="w-5 h-5" /> : <FiXCircle className="w-5 h-5" />}
            </div>
          </div>
          <div className={`text-xl font-extrabold ${user?.available ? 'text-emerald-700' : 'text-slate-600'}`}>
            {user?.available ? 'AVAILABLE' : 'PAUSED'}
          </div>
          <p className="text-[11px] text-slate-400">Visible to partner hospitals</p>
        </div>

      </div>

      {/* Quick Actions & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity Table (2 columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
              <p className="text-xs text-slate-500">Your latest donations and platform responses</p>
            </div>
            <Link to="/donor/history" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Activity Type</th>
                  <th className="p-3">Facility</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 text-slate-900">{act.date}</td>
                    <td className="p-3 text-slate-700">{act.type}</td>
                    <td className="p-3 text-slate-500">{act.location}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Card (1 column) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Quick Actions</h2>
            <p className="text-xs text-slate-500 mb-4">Fast shortcuts for donor operations</p>

            <div className="space-y-3">
              <Link
                to="/donor/requests"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiDroplet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">View Blood Requests</h4>
                    <p className="text-[10px] text-slate-500">Check urgent hospital needs</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-brand-600">→</span>
              </Link>

              <Link
                to="/donor/profile"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Update Profile</h4>
                    <p className="text-[10px] text-slate-500">Manage address & contact info</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-brand-600">→</span>
              </Link>

              <Link
                to="/donor/history"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FiList className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Donation History</h4>
                    <p className="text-[10px] text-slate-500">Review past contributions</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-brand-600">→</span>
              </Link>
            </div>
          </div>

          <div className="p-4 bg-brand-50 border border-brand-200 rounded-2xl text-xs text-brand-900 space-y-1">
            <span className="font-bold block">💡 Did you know?</span>
            <p className="text-[11px] leading-relaxed">
              Donating blood every 3 months promotes new red blood cell creation and supports cardiovascular health!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DonorDashboard;
