import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import {
  FiArrowLeft,
  FiUser,
  FiDroplet,
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
  FiCalendar,
} from 'react-icons/fi';

const DonorProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    bloodGroup: '',
    city: '',
    address: '',
    available: true,
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const fetchDonorProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getDonorById(id);
      if (res.success && (res.donor || res.data)) {
        const d = res.donor || res.data;
        setDonor(d);
        setEditForm({
          name: d.name || '',
          phone: d.phone || '',
          gender: d.gender || '',
          dateOfBirth: d.dateOfBirth || '',
          bloodGroup: d.bloodGroup || 'A+',
          city: d.city || '',
          address: d.address || '',
          available: d.available !== false,
        });
      } else {
        setError(res.message || 'Donor profile not found.');
      }
    } catch (err) {
      console.error('Error loading donor profile:', err);
      setError('Unable to load donor profile details from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDonorProfile();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!donor) return;
    try {
      const newStatus = !(donor.isActive !== false);
      const res = await adminService.updateDonorStatus(donor._id, newStatus);
      if (res.success) {
        showToast(
          `Donor account ${newStatus ? 'activated' : 'deactivated'} successfully.`,
          newStatus ? 'success' : 'info'
        );
        fetchDonorProfile();
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
      const res = await adminService.updateDonor(id, editForm);
      if (res.success) {
        showToast('Donor profile updated successfully.', 'success');
        setEditModalOpen(false);
        fetchDonorProfile();
      } else {
        showToast(res.message || 'Failed to update donor profile.', 'error');
      }
    } catch (err) {
      showToast('Error saving donor profile edits.', 'error');
    }
  };

  const handleDeleteDonor = async () => {
    try {
      const res = await adminService.deleteDonor(id);
      if (res.success) {
        showToast('Donor profile deleted successfully.', 'success');
        setTimeout(() => navigate('/admin/donors'), 1000);
      } else {
        showToast(res.message || 'Failed to delete donor.', 'error');
      }
    } catch (err) {
      showToast('Error deleting donor account.', 'error');
    }
  };

  const getAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return dob;
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age > 0 ? `${age} years` : 'N/A';
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 space-y-3">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold">Loading donor profile from MongoDB Atlas...</p>
      </div>
    );
  }

  if (error || !donor) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/admin/donors')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <FiArrowLeft /> Back to Donors List
        </button>
        <div className="p-8 bg-red-50 border border-red-200 rounded-3xl text-red-700 text-sm flex items-center gap-3">
          <FiAlertCircle className="w-6 h-6 shrink-0 text-red-500" />
          <span>{error || 'Donor account not found.'}</span>
        </div>
      </div>
    );
  }

  const isActive = donor.isActive !== false;
  const isAvailable = donor.available !== false;

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

      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/admin/donors')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-red-600 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to Donor Directory
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
            {isActive ? 'Deactivate Account' : 'Activate Account'}
          </button>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors"
          >
            <FiTrash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-5">
          <img
            src={donor.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={donor.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-red-500 shadow-md shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black">{donor.name}</h1>
              <BloodGroupBadge bloodGroup={donor.bloodGroup} />
            </div>
            <p className="text-xs text-slate-300 font-medium">{donor.email} • {donor.phone}</p>
            <p className="text-xs text-slate-400">{donor.city}, India</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
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
      </div>

      {/* Detailed Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. PERSONAL INFORMATION */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiUser className="text-red-600" /> Personal Information
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Full Name:</span>
              <span className="font-bold text-slate-900">{donor.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Email Address:</span>
              <span className="font-bold text-slate-900">{donor.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Phone Number:</span>
              <span className="font-bold text-slate-900">{donor.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Gender:</span>
              <span className="font-bold text-slate-900">{donor.gender || 'Not specified'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Date of Birth / Age:</span>
              <span className="font-bold text-slate-900">
                {donor.dateOfBirth ? `${donor.dateOfBirth} (${getAge(donor.dateOfBirth)})` : 'Not specified'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. DONATION INFORMATION */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiDroplet className="text-red-600" /> Donation Information
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Blood Group:</span>
              <span className="font-bold text-slate-900">{donor.bloodGroup}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Availability Status:</span>
              <span>
                {isAvailable ? (
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                    Available for Donation
                  </span>
                ) : (
                  <span className="font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full text-[11px]">
                    Unavailable
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Total Donations:</span>
              <span className="font-bold text-blue-600 text-sm">{donor.totalDonations || 0} Record(s)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Last Donation Date:</span>
              <span className="font-bold text-slate-900">
                {donor.lastDonationDate
                  ? new Date(donor.lastDonationDate).toLocaleDateString()
                  : 'No recorded donations yet'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. LOCATION INFORMATION */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiMapPin className="text-red-600" /> Location Details
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">City:</span>
              <span className="font-bold text-slate-900">{donor.city}</span>
            </div>
            <div className="py-1">
              <span className="text-slate-500 font-medium block mb-1">Full Residential Address:</span>
              <p className="font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {donor.address}
              </p>
            </div>
          </div>
        </div>

        {/* 4. ACCOUNT INFORMATION */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiShield className="text-red-600" /> Account Security & Information
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">User Role:</span>
              <span className="font-bold uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-[10px]">
                {donor.role}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Account Status:</span>
              <span className={`font-bold ${isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Registration Date:</span>
              <span className="font-bold text-slate-900">
                {donor.createdAt ? new Date(donor.createdAt).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Last Login Timestamp:</span>
              <span className="font-bold text-slate-900">
                {donor.lastLoginAt ? new Date(donor.lastLoginAt).toLocaleString() : 'Never logged in'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Donor Profile"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={editForm.bloodGroup}
                  onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={editForm.dateOfBirth}
                  onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Availability</label>
                <select
                  value={editForm.available ? 'true' : 'false'}
                  onChange={(e) => setEditForm({ ...editForm, available: e.target.value === 'true' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Address</label>
              <textarea
                rows={2}
                required
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
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
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
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
          title="Confirm Donor Profile Deletion"
        >
          <div className="space-y-4 text-slate-700 text-xs">
            <p className="font-medium text-slate-900 text-sm">
              Are you sure you want to delete this donor?
            </p>
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-1">
              <p className="font-bold">Donor: {donor.name} ({donor.email})</p>
              <p className="text-[11px]">
                This action is irreversible and will delete the user account from MongoDB.
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
                onClick={handleDeleteDonor}
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

export default DonorProfileView;
