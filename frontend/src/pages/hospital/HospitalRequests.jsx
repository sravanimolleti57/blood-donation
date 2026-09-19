import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import { FiFilePlus, FiTrash2, FiCheckCircle } from 'react-icons/fi';

const HospitalRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/blood-requests', {
        params: { requester: user?.id || user?._id },
      });
      if (data.success) {
        setRequests(data.bloodRequests || data.data || []);
      }
    } catch (error) {
      console.error('Error fetching hospital requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blood request?')) return;
    try {
      const { data } = await API.delete(`/blood-requests/${id}`);
      if (data.success) {
        setToast({ type: 'success', message: 'Blood request deleted successfully.' });
        fetchRequests();
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete request.',
      });
    }
  };

  const handleMarkFulfilled = async (id) => {
    try {
      const { data } = await API.patch(`/blood-requests/${id}/status`, { status: 'fulfilled' });
      if (data.success) {
        setToast({ type: 'success', message: 'Request marked as FULFILLED!' });
        fetchRequests();
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update request status.',
      });
    }
  };

  return (
    <div className="space-y-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Hospital Blood Requests</h1>
          <p className="text-xs text-slate-500">History of all blood requests published by your medical facility</p>
        </div>
        <Link to="/hospital/create-request">
          <Button icon={FiFilePlus}>New Request</Button>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
              <tr>
                <th className="p-4">Hospital Name</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Units Required</th>
                <th className="p-4">Urgency</th>
                <th className="p-4">Posted Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-xs text-slate-400">
                    Loading requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-xs text-slate-500">
                    No blood requests found. Click 'New Request' to create one.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{req.hospitalName}</td>
                    <td className="p-4">
                      <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                    </td>
                    <td className="p-4 font-bold text-slate-900">{req.unitsRequired} Unit(s)</td>
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
                    <td className="p-4 text-slate-500 text-xs">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ''}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
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
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {req.status !== 'fulfilled' && (
                          <button
                            title="Mark as Fulfilled"
                            onClick={() => handleMarkFulfilled(req._id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <FiCheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          title="Delete Request"
                          onClick={() => handleDelete(req._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
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

export default HospitalRequests;
