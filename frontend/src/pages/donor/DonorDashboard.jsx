import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import TiltCard from '../../components/ui/TiltCard';
import BloodParticles from '../../components/3d/BloodParticles';
import API from '../../services/api';
import {
  FiHeart,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiDroplet,
  FiUser,
  FiList,
  FiRefreshCw,
  FiArrowRight,
  FiCalendar,
} from 'react-icons/fi';

const DonorDashboard = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [myDonations, setMyDonations] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setFetchingHistory(true);
    try {
      const { data } = await API.get('/donations/my-history');
      if (data.success) {
        setMyDonations(data.donations || data.data || []);
      }
    } catch (err) {
      console.error('Error fetching donor history:', err);
    } finally {
      setFetchingHistory(false);
    }
  };

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

  const lastDonation = myDonations.length > 0 ? myDonations[0] : null;

  return (
    <div className="space-y-8 relative overflow-hidden">
      {/* Subtle Background Particles for Dashboard */}
      <BloodParticles count={25} speed={0.4} />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Top Banner Greeting */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300 hover:shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-red-600 to-brand-600 bg-clip-text text-transparent">{user?.name || 'Donor'}</span>! 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light">
            Your contribution helps save lives. Keep your availability updated for emergency requests in{' '}
            <span className="font-semibold text-slate-700">{user?.city || 'your area'}</span>.
          </p>
        </div>

        {/* Quick Availability Card / Button */}
        <div className="w-full md:w-auto p-4 bg-slate-50/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 flex items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className={`w-3.5 h-3.5 rounded-full ${user?.available ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
              {user?.available && (
                <div className="absolute w-5 h-5 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Donor Status</span>
              <span className={`text-xs font-black ${user?.available ? 'text-emerald-700' : 'text-slate-600'}`}>
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
            className="shadow-xs hover:shadow-md transition-all"
          >
            {user?.available ? 'Set Unavailable' : 'Set Available'}
          </Button>
        </div>
      </div>

      {/* 3D Interactive Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Donations */}
        <TiltCard className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Donations</span>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
              <FiHeart className="w-5 h-5 group-hover:animate-pulse" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {fetchingHistory ? (
              <span className="text-slate-300">...</span>
            ) : (
              <AnimatedCounter value={myDonations.length} duration={1200} />
            )}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Verified database records</p>
        </TiltCard>

        {/* Card 2: Last Donation */}
        <TiltCard className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Last Donation</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <FiClock className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
            {lastDonation ? new Date(lastDonation.donationDate || lastDonation.createdAt).toLocaleDateString() : 'None Yet'}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <FiCalendar className="w-3 h-3" /> Eligible to donate
          </p>
        </TiltCard>

        {/* Card 3: Blood Group with 3D Drop Visual Accent */}
        <TiltCard className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-red-500/10 rounded-full blur-lg group-hover:scale-125 transition-transform"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Blood Group</span>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-sm group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
              <FiDroplet className="w-5 h-5 drop-shadow-xs animate-bounce-subtle" />
            </div>
          </div>
          <div className="pt-1 flex items-center gap-2">
            <BloodGroupBadge bloodGroup={user?.bloodGroup || 'N/A'} size="lg" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Registered donor profile</p>
        </TiltCard>

        {/* Card 4: Availability with Animated Green Pulse */}
        <TiltCard className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Availability</span>
            <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center shadow-xs transition-all duration-300 ${
              user?.available ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {user?.available ? (
                <FiCheckCircle className="w-5 h-5" />
              ) : (
                <FiXCircle className="w-5 h-5" />
              )}
            </div>
          </div>
          <div className={`text-xl font-black tracking-tight ${user?.available ? 'text-emerald-700' : 'text-slate-600'}`}>
            {user?.available ? 'AVAILABLE' : 'PAUSED'}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Visible to medical facilities</p>
        </TiltCard>

      </div>

      {/* Quick Actions & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Timeline & Recent History Table */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Recent Donation History</h2>
              <p className="text-xs text-slate-500">Your logged blood contributions</p>
            </div>
            <Link to="/donor/history" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-all hover:translate-x-0.5">
              View All <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="relative">
            {fetchingHistory ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading verified history records...</div>
            ) : myDonations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                No donation records available.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3 rounded-l-xl">Date</th>
                      <th className="p-3">Blood Group</th>
                      <th className="p-3">Units</th>
                      <th className="p-3">Hospital / Location</th>
                      <th className="p-3 rounded-r-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {myDonations.slice(0, 5).map((d, index) => (
                      <tr
                        key={d._id}
                        className="hover:bg-rose-50/30 transition-all duration-200 transform hover:scale-[1.005]"
                        style={{
                          animation: `fadeInUp 0.4s ease-out ${index * 0.08}s both`,
                        }}
                      >
                        <td className="p-3 text-slate-900 font-bold">
                          {new Date(d.donationDate || d.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 font-extrabold text-brand-600">{d.bloodGroup}</td>
                        <td className="p-3 text-slate-800">{d.units || 1} Unit(s)</td>
                        <td className="p-3 text-slate-600 font-light">{d.hospitalName || d.hospital?.name || 'General Donation'}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                            {d.status || 'completed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-1">Quick Actions</h2>
            <p className="text-xs text-slate-500 mb-5">Fast shortcuts for donor operations</p>

            <div className="space-y-3.5">
              <Link
                to="/donor/requests"
                className="flex items-center justify-between p-4 bg-slate-50/80 hover:bg-brand-50/60 border border-slate-200/80 hover:border-brand-300 rounded-2xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-sm group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-200 shadow-xs">
                    <FiDroplet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-red-700 transition-colors">View Blood Requests</h4>
                    <p className="text-[10px] text-slate-500">Check urgent hospital requests</p>
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/donor/profile"
                className="flex items-center justify-between p-4 bg-slate-50/80 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-300 rounded-2xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-sm group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shadow-xs">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">Update Profile</h4>
                    <p className="text-[10px] text-slate-500">Manage address & contact info</p>
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/donor/history"
                className="flex items-center justify-between p-4 bg-slate-50/80 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 rounded-2xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-sm group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200 shadow-xs">
                    <FiList className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">Donation History</h4>
                    <p className="text-[10px] text-slate-500">Review past contributions</p>
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50/60 border border-red-200/70 rounded-2xl text-xs text-red-950 space-y-1 shadow-xs">
            <span className="font-bold block text-red-800">💡 Did you know?</span>
            <p className="text-[11px] leading-relaxed text-red-900/90 font-light">
              Donating blood every 3 months promotes new red blood cell creation and supports cardiovascular health!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
