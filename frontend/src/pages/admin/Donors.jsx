import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiUserCheck,
  FiUserX,
  FiAlertCircle,
  FiUser,
} from 'react-icons/fi';

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCity, setSelectedCity] = useState('');

  // Modals & Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ open: false, donor: null });
  const [editModal, setEditModal] = useState({ open: false, donor: null });
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

  const fetchDonors = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedBloodGroup !== 'all') params.bloodGroup = selectedBloodGroup;
      if (selectedAvailability !== 'all') params.availability = selectedAvailability;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedCity.trim()) params.city = selectedCity.trim();

      const res = await adminService.getDonors(params);
      if (res.success) {
        setDonors(res.donors || res.data || []);
      } else {
        setError(res.message || 'Unable to load donor profiles. Please try again.');
      }
    } catch (err) {
      console.error('Error loading donors:', err);
      setError('Unable to load donor profiles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [selectedBloodGroup, selectedAvailability, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  // Toggle Activate / Deactivate
  const handleToggleStatus = async (donor) => {
    try {
      const newStatus = !(donor.isActive !== false);
      const res = await adminService.updateDonorStatus(donor._id, newStatus);
      if (res.success) {
        showToast(
          `Donor account ${newStatus ? 'activated' : 'deactivated'} successfully.`,
          newStatus ? 'success' : 'info'
        );
        fetchDonors();
      } else {
        showToast(res.message || 'Failed to update donor status.', 'error');
      }
    } catch (err) {
      showToast('Server error updating account status.', 'error');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (donor) => {
    setEditModal({ open: true, donor });
    setEditForm({
      name: donor.name || '',
      phone: donor.phone || '',
      gender: donor.gender || '',
      dateOfBirth: donor.dateOfBirth || '',
      bloodGroup: donor.bloodGroup || 'A+',
      city: donor.city || '',
      address: donor.address || '',
      available: donor.available !== false,
    });
  };

  // Save Edit Donor Profile
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminService.updateDonor(editModal.donor._id, editForm);
      if (res.success) {
        showToast('Donor profile updated successfully.', 'success');
        setEditModal({ open: false, donor: null });
        fetchDonors();
      } else {
        showToast(res.message || 'Failed to update donor profile.', 'error');
      }
    } catch (err) {
      showToast('Error saving donor profile updates.', 'error');
    }
  };

  // Delete Donor Action
  const handleDeleteDonor = async () => {
    if (!deleteModal.donor) return;
    try {
      const res = await adminService.deleteDonor(deleteModal.donor._id);
      if (res.success) {
        showToast('Donor profile deleted successfully.', 'success');
        setDeleteModal({ open: false, donor: null });
        fetchDonors();
      } else {
        showToast(res.message || 'Failed to delete donor profile.', 'error');
      }
    } catch (err) {
      showToast('Server error deleting donor profile.', 'error');
    }
  };

  // Age calculation helper
  const getAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return dob;
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age > 0 ? `${age} yrs` : 'N/A';
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FiUser className="text-red-600" />
            Donor Profile Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage registered blood donor accounts, review personal information, and update availability status.
          </p>
        </div>
        <button
          onClick={fetchDonors}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh List
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-4">
          {/* Keyword Search Input */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search donor by Name, Email, Phone, City, Blood Group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>

          {/* City Filter Input */}
          <div className="w-full lg:w-48">
            <input
              type="text"
              placeholder="Filter by City..."
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              onBlur={fetchDonors}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
          >
            Search Donors
          </button>
        </form>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
            <FiFilter className="w-3.5 h-3.5 text-red-500" /> Filters:
          </div>

          {/* Blood Group Filter */}
          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-medium">Blood Group:</label>
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-red-500"
            >
              <option value="all">All Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-medium">Availability:</label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-red-500"
            >
              <option value="all">All</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-medium">Account Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-red-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {(selectedBloodGroup !== 'all' || selectedAvailability !== 'all' || selectedStatus !== 'all' || selectedCity || searchTerm) && (
            <button
              onClick={() => {
                setSelectedBloodGroup('all');
                setSelectedAvailability('all');
                setSelectedStatus('all');
                setSelectedCity('');
                setSearchTerm('');
              }}
              className="text-red-600 hover:text-red-800 text-xs font-bold underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-3">
          <FiAlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Donors Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-medium">Fetching donor accounts from MongoDB...</p>
          </div>
        ) : donors.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <div className="text-3xl">🩸</div>
            <p className="text-sm font-bold text-slate-700">No donor profiles found.</p>
            <p className="text-xs text-slate-400">Try adjusting your search query or reset filter settings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Donor Name</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Blood Group</th>
                  <th className="py-3.5 px-4">Gender / Age</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {donors.map((donor) => {
                  const isActive = donor.isActive !== false;
                  const isAvailable = donor.available !== false;

                  return (
                    <tr key={donor._id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name */}
                      <td className="py-4 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={donor.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                            alt={donor.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <Link
                              to={`/admin/donors/${donor._id}`}
                              className="hover:text-red-600 transition-colors truncate block font-bold"
                            >
                              {donor.name}
                            </Link>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <p className="font-medium text-slate-800">{donor.email}</p>
                          <p className="text-[11px] text-slate-500">{donor.phone}</p>
                        </div>
                      </td>

                      {/* Blood Group */}
                      <td className="py-4 px-4">
                        <BloodGroupBadge bloodGroup={donor.bloodGroup} />
                      </td>

                      {/* Gender / Age */}
                      <td className="py-4 px-4 font-medium">
                        {donor.gender || 'N/A'} • {getAge(donor.dateOfBirth)}
                      </td>

                      {/* City */}
                      <td className="py-4 px-4 font-medium text-slate-800">
                        {donor.city}
                      </td>

                      {/* Availability */}
                      <td className="py-4 px-4">
                        {isAvailable ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <FiCheckCircle className="w-3 h-3" /> Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            <FiXCircle className="w-3 h-3" /> Unavailable
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                            <FiUserCheck className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                            <FiUserX className="w-3 h-3" /> Inactive
                          </span>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="py-4 px-4 text-slate-500 font-medium">
                        {donor.createdAt ? new Date(donor.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Profile */}
                          <Link
                            to={`/admin/donors/${donor._id}`}
                            title="View Full Profile"
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>

                          {/* Edit Profile */}
                          <button
                            onClick={() => handleOpenEdit(donor)}
                            title="Edit Donor Profile"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>

                          {/* Activate / Deactivate Toggle */}
                          <button
                            onClick={() => handleToggleStatus(donor)}
                            title={isActive ? 'Deactivate Account' : 'Activate Account'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isActive
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {isActive ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
                          </button>

                          {/* Delete Account */}
                          <button
                            onClick={() => setDeleteModal({ open: true, donor })}
                            title="Delete Donor Account"
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Donor Profile Modal */}
      {editModal.open && editModal.donor && (
        <Modal
          isOpen={editModal.open}
          onClose={() => setEditModal({ open: false, donor: null })}
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
                  <option value="true">Available for Donation</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Address</label>
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
                onClick={() => setEditModal({ open: false, donor: null })}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Donor Confirmation Modal */}
      {deleteModal.open && deleteModal.donor && (
        <Modal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, donor: null })}
          title="Confirm Donor Account Deletion"
        >
          <div className="space-y-4 text-slate-700 text-xs">
            <p className="font-medium text-slate-900 text-sm">
              Are you sure you want to delete this donor?
            </p>
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-1">
              <p className="font-bold">Donor: {deleteModal.donor.name} ({deleteModal.donor.email})</p>
              <p className="text-[11px]">
                This action will remove the donor profile from MongoDB. Associated donation records will be safely detached.
              </p>
            </div>
            <div className="pt-3 flex justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDeleteModal({ open: false, donor: null })}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteDonor}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
              >
                Delete Donor
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Donors;
