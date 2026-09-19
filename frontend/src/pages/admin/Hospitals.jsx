import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import { FiCheckCircle, FiXCircle, FiActivity } from 'react-icons/fi';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/hospitals');
      if (data.success) {
        setHospitals(data.hospitals || data.data || []);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load hospital accounts.',
      });
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      const { data } = await API.put(`/admin/users/${id}`, { verified: status });
      if (data.success) {
        setHospitals(hospitals.map((h) => (h._id === id ? { ...h, verified: status } : h)));
        setToast({
          type: 'success',
          message: `Hospital verification state updated to ${status ? 'VERIFIED' : 'PENDING/UNVERIFIED'}`,
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update hospital status',
      });
    }
  };

  return (
    <div className="space-y-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Hospital Verification Management</h1>
          <p className="text-xs text-slate-500">Review licensing details and verify registered medical facilities</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <FiActivity className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
              <tr>
                <th className="p-4">Hospital Name</th>
                <th className="p-4">Contact Person</th>
                <th className="p-4">Email / City</th>
                <th className="p-4">License #</th>
                <th className="p-4">Status</th>
                <th className="p-4">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-xs text-slate-400">
                    Loading hospital accounts...
                  </td>
                </tr>
              ) : hospitals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-xs text-slate-400">
                    No hospital accounts found.
                  </td>
                </tr>
              ) : (
                hospitals.map((h) => (
                  <tr key={h._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{h.name}</td>
                    <td className="p-4">{h.contactPerson || 'N/A'}</td>
                    <td className="p-4 text-xs">
                      <div className="text-slate-900">{h.email}</div>
                      <div className="text-slate-400">{h.city}</div>
                    </td>
                    <td className="p-4 font-mono text-xs">{h.hospitalLicenseNumber || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${h.verified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                        {h.verified ? '✓ VERIFIED' : '⏳ PENDING'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {!h.verified ? (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleVerify(h._id, true)}
                            icon={FiCheckCircle}
                          >
                            Verify
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleVerify(h._id, false)}
                            icon={FiXCircle}
                          >
                            Revoke
                          </Button>
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

export default Hospitals;
