import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import { FiCheckSquare, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getAllDonations();
      if (res.success) {
        setDonations(res.donations || res.data || []);
      } else {
        setError(res.message || 'Unable to load donation records.');
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError('Server error retrieving donation records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FiCheckSquare className="text-emerald-600" />
            System Donations Log
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review completed and logged blood donation records across all donors and partner medical facilities.
          </p>
        </div>
        <button
          onClick={fetchDonations}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Log
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-3">
          <FiAlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Donations Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-medium">Fetching donation records from MongoDB...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <div className="text-3xl">🩺</div>
            <p className="text-sm font-bold text-slate-700">No donation records found.</p>
            <p className="text-xs text-slate-400">Completed donor contributions will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Donor Name</th>
                  <th className="py-3.5 px-4">Blood Group</th>
                  <th className="py-3.5 px-4">Units</th>
                  <th className="py-3.5 px-4">Hospital / Facility</th>
                  <th className="py-3.5 px-4">Donation Date</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {donations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {donation.donor ? donation.donor.name : 'Anonymous Donor'}
                      {donation.donor?.email && (
                        <span className="block text-[11px] text-slate-400 font-normal">
                          {donation.donor.email}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <BloodGroupBadge bloodGroup={donation.bloodGroup} />
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800">
                      {donation.units} Unit(s)
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-800">
                      {donation.hospital?.name || donation.hospitalName || 'Local Medical Center'}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-medium">
                      {donation.donationDate ? new Date(donation.donationDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                        {donation.status || 'Completed'}
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
  );
};

export default AdminDonations;
