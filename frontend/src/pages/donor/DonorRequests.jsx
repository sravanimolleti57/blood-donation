import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import { FiDroplet, FiMapPin, FiClock, FiPhone } from 'react-icons/fi';

const DonorRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [respondingId, setRespondingId] = useState(null);

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
      console.error('Error fetching blood requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (reqItem) => {
    setRespondingId(reqItem._id);
    try {
      const { data } = await API.post('/donations', {
        bloodRequestId: reqItem._id,
        bloodGroup: reqItem.bloodGroup,
        units: 1,
        hospitalName: reqItem.hospitalName,
        status: 'completed',
        notes: `Donor ${user?.name || ''} responded to emergency request for ${reqItem.hospitalName}`,
      });

      if (data.success) {
        setToast({
          type: 'success',
          message: `Thank you! Your donation response to ${reqItem.hospitalName} has been logged.`,
        });
        fetchRequests();
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to submit response.',
      });
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Active Blood Requests</h1>
          <p className="text-xs text-slate-500">Urgent blood requirements requested by verified medical facilities</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
          <FiDroplet className="w-5 h-5" />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading active blood requests...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 text-sm">
          No blood requests found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">STATUS: {req.status?.toUpperCase()}</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      req.urgency === 'critical'
                        ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse'
                        : req.urgency === 'urgent'
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {req.urgency}
                  </span>
                </div>

                <div className="pt-1">
                  <h3 className="text-base font-bold text-slate-900">{req.hospitalName}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <FiMapPin className="w-3.5 h-3.5 text-red-600" />
                    {req.hospitalAddress}, {req.city}
                  </p>
                  {req.contactPhone && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <FiPhone className="w-3.5 h-3.5 text-slate-400" />
                      Contact: {req.contactPhone}
                    </p>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Required</span>
                    <BloodGroupBadge bloodGroup={req.bloodGroup} size="md" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Units</span>
                    <span className="text-sm font-bold text-slate-900">{req.unitsRequired} Unit(s)</span>
                  </div>
                </div>

                {req.description && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{req.description}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <FiClock className="w-3.5 h-3.5" />
                  {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ''}
                </span>
                <Button
                  size="sm"
                  loading={respondingId === req._id}
                  onClick={() => handleRespond(req)}
                >
                  Respond
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorRequests;
