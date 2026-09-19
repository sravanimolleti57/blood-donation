import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import Button from '../../components/Button';
import API from '../../services/api';
import {
  FiFilePlus,
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiAlertCircle,
  FiList,
} from 'react-icons/fi';

const HospitalDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospitalData();
  }, [user]);

  const fetchHospitalData = async () => {
    setLoading(true);
    try {
      const [reqRes, donRes] = await Promise.all([
        API.get('/blood-requests', { params: { requester: user?.id || user?._id } }),
        API.get('/donations'),
      ]);

      if (reqRes.data.success) {
        setRequests(reqRes.data.bloodRequests || reqRes.data.data || []);
      }
      if (donRes.data.success) {
        setDonations(donRes.data.donations || donRes.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching hospital dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeRequestsCount = requests.filter((r) => r.status === 'approved' || r.status === 'pending').length;
  const completedRequestsCount = requests.filter((r) => r.status === 'fulfilled').length;
  const totalUnitsReceived = donations.reduce((sum, d) => sum + (d.units || 1), 0);

  return (
    <div className="space-y-8">
      {/* Top Banner Greeting */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {user?.name || 'Hospital Dashboard'}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                user?.verified
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {user?.verified ? '✓ Verified Hospital' : '⏳ Pending Verification'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            License: {user?.hospitalLicenseNumber || 'N/A'} | Contact: {user?.contactPerson || user?.phone || 'Medical Officer'}
          </p>
        </div>

        <Link to="/hospital/create-request">
          <Button size="lg" icon={FiFilePlus}>
            Create Blood Request
          </Button>
        </Link>
      </div>

      {!user?.verified && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-800">
          <FiAlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900">Verification Pending</h4>
            <p className="mt-0.5">
              Your hospital account is registered and awaiting administrator license verification.
            </p>
          </div>
        </div>
      )}

      {/* Hospital Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Requests</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <FiActivity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{loading ? '...' : activeRequestsCount}</div>
          <p className="text-[11px] text-red-600 font-medium">Currently seeking donors</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fulfilled Requests</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{loading ? '...' : completedRequestsCount}</div>
          <p className="text-[11px] text-slate-400">Fulfilled in MongoDB</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Requests</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiUsers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{loading ? '...' : requests.length}</div>
          <p className="text-[11px] text-slate-400">Total hospital posts</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Units Received</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FiClock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{loading ? '...' : `${totalUnitsReceived} Units`}</div>
          <p className="text-[11px] text-slate-400">Total logged volume</p>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Hospital Blood Requests</h2>
            <p className="text-xs text-slate-500">Monitor live status of your facility's requirements</p>
          </div>
          <Link to="/hospital/requests">
            <Button size="sm" variant="outline" icon={FiList}>
              View All Requests
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No blood requests found.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Hospital Facility</th>
                  <th className="p-3">Blood Group</th>
                  <th className="p-3">Units Required</th>
                  <th className="p-3">Urgency Level</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {requests.slice(0, 5).map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{req.hospitalName}</td>
                    <td className="p-3">
                      <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                    </td>
                    <td className="p-3 font-bold text-slate-900">{req.unitsRequired} Unit(s)</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          req.urgency === 'critical'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : req.urgency === 'urgent'
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          req.status === 'fulfilled'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : req.status === 'approved'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
