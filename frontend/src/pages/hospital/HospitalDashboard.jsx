import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import Button from '../../components/Button';
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

  const activeRequests = [
    { id: 'REQ-101', bloodGroup: 'O-', units: 3, urgency: 'URGENT', status: 'Active', responses: 4, date: 'Today, 10:30 AM' },
    { id: 'REQ-102', bloodGroup: 'AB+', units: 2, urgency: 'NORMAL', status: 'Active', responses: 2, date: 'Yesterday' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Banner Greeting */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {user?.name || 'Hospital Dashboard'}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${user?.verified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
              {user?.verified ? '✓ Verified Hospital' : '⏳ Pending Verification'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            License: {user?.hospitalLicenseNumber || 'REG-HOSP-2026'} | Contact: {user?.contactPerson || 'Medical Officer'}
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
              Your hospital account is currently under review by system administrators. Emergency blood request creation will be fully enabled once verified.
            </p>
          </div>
        </div>
      )}

      {/* Hospital Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Requests</span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <FiActivity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">2</div>
          <p className="text-[11px] text-brand-600 font-medium">Currently seeking donors</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Requests</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">18</div>
          <p className="text-[11px] text-slate-400">Fulfilled on platform</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Donors Responded</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiUsers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">34</div>
          <p className="text-[11px] text-slate-400">Total matched donors</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Units Received</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FiClock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">45 Units</div>
          <p className="text-[11px] text-slate-400">Total emergency volume</p>
        </div>

      </div>

      {/* Recent Requests Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Hospital Requests</h2>
            <p className="text-xs text-slate-500">Monitor live status of your facility's requirements</p>
          </div>
          <Link to="/hospital/requests">
            <Button size="sm" variant="outline" icon={FiList}>
              View All Requests
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Request ID</th>
                <th className="p-3">Blood Group</th>
                <th className="p-3">Units Required</th>
                <th className="p-3">Urgency Level</th>
                <th className="p-3">Donors Responded</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {activeRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{req.id}</td>
                  <td className="p-3">
                    <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                  </td>
                  <td className="p-3 font-bold text-slate-900">{req.units} Units</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${req.urgency === 'URGENT' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-700'}`}>
                      {req.urgency}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700 font-semibold">{req.responses} Donors</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
