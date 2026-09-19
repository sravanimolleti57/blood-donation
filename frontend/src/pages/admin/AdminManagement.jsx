import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Toast from '../../components/Toast';
import { FiShield, FiUserCheck, FiUserX, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/management');
      if (data.success) {
        setAdmins(data.admins || data.data || []);
      }
    } catch (error) {
      console.error('Error fetching admin accounts:', error);
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load system administrators.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FiShield className="text-purple-600" />
            System Admin Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Overview of authorized system administrator accounts with role-based access control.
          </p>
        </div>
        <button
          onClick={fetchAdmins}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh List
        </button>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-medium">Fetching administrator accounts from MongoDB...</p>
          </div>
        ) : admins.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <FiAlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No administrator accounts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Administrator Name</th>
                  <th className="py-3.5 px-4">Email Address</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {admins.map((adm) => {
                  const isActive = adm.isActive !== false;

                  return (
                    <tr key={adm._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                          🛡️
                        </span>
                        <span>{adm.name}</span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">{adm.email}</td>
                      <td className="py-4 px-4 text-slate-500">{adm.phone || 'N/A'}</td>
                      <td className="py-4 px-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            <FiUserCheck className="w-3 h-3" /> Active Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                            <FiUserX className="w-3 h-3" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-medium">
                        {adm.createdAt ? new Date(adm.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-medium">
                        {adm.lastLoginAt ? new Date(adm.lastLoginAt).toLocaleString() : 'Never'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;
