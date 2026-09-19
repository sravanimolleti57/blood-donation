import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import {
  FiArrowLeft,
  FiActivity,
  FiMapPin,
  FiShield,
  FiEdit,
  FiUserCheck,
  FiUserX,
  FiTrash2,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiFileText,
  FiDroplet,
} from 'react-icons/fi';

const HospitalProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    hospitalLicenseNumber: '',
    contactPerson: '',
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const fetchHospitalProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getHospitalById(id);
      if (res.success && (res.hospital || res.data)) {
        const h = res.hospital || res.data;
        setHospital(h);
        setEditForm({
          name: h.name || '',
          phone: h.phone || '',
          city: h.city || '',
          address: h.address || '',
          hospitalLicenseNumber: h.hospitalLicenseNumber || '',
          contactPerson: h.contactPerson || '',
        });
      } else {
        setError(res.message || 'Hospital account not found.');
      }
    } catch (err) {
      console.error('Error fetching hospital profile:', err);
      setError('Unable to load hospital profile details from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchHospitalProfile();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!hospital) return;
    try {
      const newStatus = !(hospital.isActive !== false);
      const res = await adminService.updateHospitalStatus(hospital._id, newStatus);
      if (res.success) {
        showToast(
          `Hospital account ${newStatus ? 'activated' : 'deactivated'} successfully.`,
          newStatus ? 'success' : 'info'
        );
        fetchHospitalProfile();
      } else {
        showToast(res.message || 'Failed to update status.', 'error');
      }
    } catch (err) {
      showToast('Error updating account status.', 'error');
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminService.updateHospital(id, editForm);
      if (res.success) {
        showToast('Hospital profile updated successfully.', 'success');
        setEditModalOpen(false);
        fetchHospitalProfile();
      } else {
        showToast(res.message || 'Failed to update hospital profile.', 'error');
      }
    } catch (err) {
      showToast('Error saving hospital profile edits.', 'error');
    }
  };

  const handleDeleteHospital = async () => {
    try {
      const res = await adminService.deleteHospital(id);
      if (res.success) {
        showToast('Hospital account deleted successfully.', 'success');
        setTimeout(() => navigate('/admin/hospitals'), 1000);
      } else {
        showToast(res.message || 'Failed to delete hospital.', 'error');
      }
    } catch (err) {
      showToast('Error deleting hospital account.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold">Loading hospital metrics from MongoDB Atlas...</p>
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/admin/hospitals')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <FiArrowLeft /> Back to Hospital Directory
        </button>
        <div className="p-8 bg-red-50 border border-red-200 rounded-3xl text-red-700 text-sm flex items-center gap-3">
          <FiAlertCircle className="w-6 h-6 shrink-0 text-red-500" />
          <span>{error || 'Hospital account not found.'}</span>
        </div>
      </div>
    );
  }

  const isActive = hospital.isActive !== false;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Navigation & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/admin/hospitals')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to Hospital Directory
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <FiEdit className="w-3.5 h-3.5" /> Edit Profile
          </button>

          <button
            onClick={handleToggleStatus}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs ${
              isActive
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isActive ? <FiUserX className="w-3.5 h-3.5" /> : <FiUserCheck className="w-3.5 h-3.5" />}
            {isActive ? 'Deactivate Hospital' : 'Activate Hospital'}
          </button>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors"
          >
            <FiTrash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>

      {/* Hospital Banner Card */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-3xl border border-blue-500/30 shrink-0">
            🏥
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black">{hospital.name}</h1>
            <p className="text-xs text-slate-300 font-medium">{hospital.email} • {hospital.phone}</p>
            <p className="text-xs text-slate-400">{hospital.city}, India</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Hospital Status
          </span>
          {isActive ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FiCheckCircle /> Active Account
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <FiXCircle /> Deactivated
            </span>
          )}
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. HOSPITAL INFORMATION */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiActivity className="text-blue-600" /> Hospital Information
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Hospital Name:</span>
              <span className="font-bold text-slate-900">{hospital.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Email Address:</span>
              <span className="font-bold text-slate-900">{hospital.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Phone Number:</span>
              <span className="font-bold text-slate-900">{hospital.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">City:</span>
              <span className="font-bold text-slate-900">{hospital.city}</span>
            </div>
            {hospital.contactPerson && (
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Contact Person:</span>
                <span className="font-bold text-slate-900">{hospital.contactPerson}</span>
              </div>
            )}
            {hospital.hospitalLicenseNumber && (
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium">License / Reg Number:</span>
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-[11px]">
                  {hospital.hospitalLicenseNumber}
                </span>
              </div>
            )}
            <div className="py-1">
              <span className="text-slate-500 font-medium block mb-1">Full Facility Address:</span>
              <p className="font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {hospital.address}
              </p>
            </div>
          </div>
        </div>

        {/* 2. ACCOUNT INFORMATION */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiShield className="text-blue-600" /> Account Security
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Account Status:</span>
              <span className={`font-bold ${isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">User Role:</span>
              <span className="font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-[10px]">
                {hospital.role}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Registration Date:</span>
              <span className="font-bold text-slate-900">
                {hospital.createdAt ? new Date(hospital.createdAt).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Last Login Timestamp:</span>
              <span className="font-bold text-slate-900">
                {hospital.lastLoginAt ? new Date(hospital.lastLoginAt).toLocaleString() : 'Never logged in'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. REQUEST INFORMATION SUMMARY */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FiDroplet className="text-red-600" /> Real Blood Request Statistics
            </h2>
            <p className="text-xs text-slate-500">Live request counts aggregated from MongoDB database for this hospital</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Database Metrics
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Requests</span>
            <div className="text-2xl font-black text-slate-900">{hospital.totalBloodRequests || 0}</div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
            <span className="text-[11px] font-bold text-amber-700 uppercase">Pending</span>
            <div className="text-2xl font-black text-amber-800">{hospital.pendingRequests || 0}</div>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-1">
            <span className="text-[11px] font-bold text-blue-700 uppercase">Approved</span>
            <div className="text-2xl font-black text-blue-800">{hospital.approvedRequests || 0}</div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">Fulfilled</span>
            <div className="text-2xl font-black text-emerald-800">{hospital.fulfilledRequests || 0}</div>
          </div>

          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold text-slate-600 uppercase">Cancelled</span>
            <div className="text-2xl font-black text-slate-700">{hospital.cancelledRequests || 0}</div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Hospital Profile"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Hospital Name</label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  value={editForm.contactPerson}
                  onChange={(e) => setEditForm({ ...editForm, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">License Number</label>
                <input
                  type="text"
                  value={editForm.hospitalLicenseNumber}
                  onChange={(e) => setEditForm({ ...editForm, hospitalLicenseNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Address</label>
              <textarea
                rows={2}
                required
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
              >
                Save Updates
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Hospital Deletion"
        >
          <div className="space-y-4 text-slate-700 text-xs">
            <p className="font-medium text-slate-900 text-sm">
              Are you sure you want to delete this hospital account?
            </p>
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-1">
              <p className="font-bold">Hospital: {hospital.name} ({hospital.email})</p>
              <p className="text-[11px]">
                Deleting this account will remove related blood requests and donation records to ensure data consistency.
              </p>
            </div>
            <div className="pt-3 flex justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteHospital}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
              >
                Delete Account
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HospitalProfileView;
