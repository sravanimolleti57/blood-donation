import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import Toast from '../../components/Toast';
import { FiDroplet, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/blood-requests');
      if (data.success) {
        setRequests(data.bloodRequests || data.data || []);
      }
    } catch (error) {
      console.error('Error fetching admin blood requests:', error);
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load blood requests.',
      });
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const { data } = await API.patch(`/blood-requests/${id}/status`, { status: newStatus });
      if (data.success) {
        setToast({
          type: 'success',
          message: `Request status updated to ${newStatus.toUpperCase()}`,
        });
        fetchRequests();
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update request status',
      });
    }
  };

  return (
    <div className="space-y-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Platform Blood Requests</h1>
          <p className="text-xs text-slate-500">Monitor and manage all emergency blood requests across the system</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
          <FiDroplet className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
              <tr>
                <th className="p-4">Hospital / Facility</th>
                <th className="p-4">City</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Units Required</th>
                <th className="p-4">Urgency</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-xs text-slate-400">
                    Loading blood requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-xs text-slate-400">
                    No blood requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{req.hospitalName}</td>
                    <td className="p-4 text-slate-500">{req.city}</td>
                    <td className="p-4">
                      <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                    </td>
                    <td className="p-4 font-bold text-slate-900">{req.unitsRequired} Units</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
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
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          req.status === 'fulfilled'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : req.status === 'approved'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : req.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {req.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(req._id, 'approved')}
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                          >
                            Approve
                          </button>
                        )}
                        {req.status !== 'fulfilled' && req.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusUpdate(req._id, 'fulfilled')}
                            className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
                          >
                            Fulfill
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRequests;
