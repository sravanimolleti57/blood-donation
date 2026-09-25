import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import TiltCard from '../../components/ui/TiltCard';
import BloodParticles from '../../components/3d/BloodParticles';
import BloodOrb from '../../components/3d/BloodOrb';
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
  FiAlertTriangle,
} from 'react-icons/fi';

const DonorDashboard = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [myDonations, setMyDonations] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setFetchingHistory(true);
    setFetchError(false);
    try {
      const { data } = await API.get('/donations/my-history');
      if (data.success) {
        setMyDonations(data.donations || data.data || []);
      } else {
        setFetchError(true);
      }
    } catch (err) {
      console.error('Error fetching donor history:', err);
      setFetchError(true);
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
      {/* Subtle Background Particles */}
      <BloodParticles count={30} speed={0.3} />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Welcome Card with 3D Floating Blood Orb & Animated Gradient */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-10 rounded-3xl border border-red-500/30 shadow-2xl overflow-hidden group">
        
        {/* Animated Glow Backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 text-brand-400 rounded-full text-xs font-semibold uppercase tracking-wider border border-brand-500/20 backdrop-blur-md mb-1">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
              Donor Portal Active
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Welcome back, <span className="bg-gradient-to-r from-brand-400 via-rose-400 to-red-500 bg-clip-text text-transparent">{user?.name || 'Donor'}</span>! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Your registered blood donations directly support local medical facilities in{' '}
              <span className="font-semibold text-white">{user?.city || 'your area'}</span>. Keep your availability updated for emergency dispatches.
            </p>
          </div>

          {/* 3D Decorative Floating Blood Orb & Quick Status Panel */}
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            
            {/* Quick Status Pill */}
            <div className="p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 flex items-center gap-4 shadow-lg">
              <div className="relative flex items-center justify-center">
                <div className={`w-3.5 h-3.5 rounded-full ${user?.available ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                {user?.available && (
                  <div className="absolute w-6 h-6 rounded-full bg-emerald-400 animate-ping opacity-60"></div>
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Donor Status</span>
                <span className={`text-xs font-black ${user?.available ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {user?.available ? 'AVAILABLE TO DONATE' : 'UNAVAILABLE'}
                </span>
              </div>
              <Button
                size="sm"
                variant={user?.available ? 'secondary' : 'primary'}
                onClick={toggleAvailability}
                loading={loading}
                icon={FiRefreshCw}
                className="ml-2 shadow-sm"
              >
                {user?.available ? 'Set Unavailable' : 'Set Available'}
              </Button>
            </div>

            {/* 3D Floating Blood Orb */}
            <div className="hidden lg:block shrink-0">
              <BloodOrb />
            </div>

          </div>
        </div>
      </div>

      {/* Statistics Cards with 3D Hover & Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Donations */}
        <TiltCard maxAngle={4} scaleOnHover={1.02} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Donations</span>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
              <FiHeart className="w-5 h-5 group-hover:animate-pulse" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {fetchingHistory ? (
              <div className="w-16 h-8 bg-slate-200 rounded animate-pulse"></div>
            ) : (
              <AnimatedCounter value={myDonations.length} duration={1000} />
            )}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Verified database records</p>
        </TiltCard>

        {/* Card 2: Last Donation */}
        <TiltCard maxAngle={4} scaleOnHover={1.02} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Last Donation</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <FiClock className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
            {fetchingHistory ? (
              <div className="w-24 h-6 bg-slate-200 rounded animate-pulse"></div>
            ) : lastDonation ? (
              new Date(lastDonation.donationDate || lastDonation.createdAt).toLocaleDateString()
            ) : (
              'None Yet'
            )}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <FiCalendar className="w-3 h-3" /> Eligible to donate
          </p>
        </TiltCard>

        {/* Card 3: Blood Group with 3D Drop Visual */}
        <TiltCard maxAngle={4} scaleOnHover={1.02} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Blood Group</span>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-sm group-hover:rotate-6 group-hover:translate-z-[20px] transition-all duration-300">
              <FiDroplet className="w-5 h-5 drop-shadow-xs" />
            </div>
          </div>
          <div className="pt-1 flex items-center gap-2">
            <BloodGroupBadge bloodGroup={user?.bloodGroup || 'N/A'} size="lg" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Registered donor profile</p>
        </TiltCard>

        {/* Card 4: Availability Status */}
        <TiltCard maxAngle={4} scaleOnHover={1.02} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 relative overflow-hidden group">
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

      {/* Main Content Grid: Donation History Timeline & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Animated Vertical Timeline History */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Recent Donation History</h2>
              <p className="text-xs text-slate-500">Your logged blood contributions</p>
            </div>
            <Link to="/donor/history" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-all hover:translate-x-1">
              View All <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {fetchingHistory ? (
            /* Skeleton Loader */
            <div className="space-y-4 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : fetchError ? (
            /* Error State Card */
            <div className="p-8 text-center bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3">
              <FiAlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Unable to load dashboard data</h3>
              <p className="text-xs text-slate-500">Please check your network connection and try again.</p>
              <Button size="sm" variant="secondary" onClick={fetchHistory} icon={FiRefreshCw}>
                Try Again
              </Button>
            </div>
          ) : myDonations.length === 0 ? (
            /* Empty State */
            <div className="p-8 text-center text-xs text-slate-500 font-medium bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
              No donation records available.
            </div>
          ) : (
            /* Vertical Timeline */
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-brand-500 before:via-rose-400 before:to-slate-200">
              {myDonations.slice(0, 4).map((d, index) => (
                <div
                  key={d._id}
                  className="relative group bg-slate-50/80 hover:bg-rose-50/40 p-4 rounded-2xl border border-slate-200/80 transition-all duration-300 hover:shadow-md hover:border-brand-300 transform hover:-translate-y-0.5"
                  style={{
                    animation: `fadeInLeft 0.4s ease-out ${index * 0.12}s both`,
                  }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[1.95rem] top-5 w-4 h-4 rounded-full bg-white border-4 border-brand-600 shadow-sm group-hover:scale-125 transition-transform"></div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {d.hospitalName || d.hospital?.name || 'General Donation Center'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-brand-100 text-brand-700">
                          {d.bloodGroup}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-3">
                        <span>Units: {d.units || 1} Unit(s)</span>
                        <span>•</span>
                        <span>{new Date(d.donationDate || d.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>

                    <span className="self-start sm:self-center px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                      {d.status || 'completed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Quick Actions */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-1">Quick Actions</h2>
            <p className="text-xs text-slate-500 mb-5">Fast shortcuts for donor operations</p>

            <div className="space-y-3.5">
              <Link
                to="/donor/requests"
                className="flex items-center justify-between p-4 bg-slate-50/80 hover:bg-brand-50/60 border border-slate-200/80 hover:border-brand-300 rounded-2xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 group-hover:bg-red-600 group-hover:text-white transition-all duration-200 shadow-xs">
                    <FiDroplet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-red-700 transition-colors">View Blood Requests</h4>
                    <p className="text-[10px] text-slate-500">Check urgent hospital requests</p>
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1.5 transition-all" />
              </Link>

              <Link
                to="/donor/profile"
                className="flex items-center justify-between p-4 bg-slate-50/80 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-300 rounded-2xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shadow-xs">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">Update Profile</h4>
                    <p className="text-[10px] text-slate-500">Manage address & contact info</p>
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1.5 transition-all" />
              </Link>

              <Link
                to="/donor/history"
                className="flex items-center justify-between p-4 bg-slate-50/80 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 rounded-2xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200 shadow-xs">
                    <FiList className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">Donation History</h4>
                    <p className="text-[10px] text-slate-500">Review past contributions</p>
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1.5 transition-all" />
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
