import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
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
  FiActivity,
} from 'react-icons/fi';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, Filter & Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');

  // Modals & Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ open: false, hospital: null });
  const [editModal, setEditModal] = useState({ open: false, hospital: null });
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

  const fetchHospitals = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCity.trim()) params.city = selectedCity.trim();
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedSort) params.sort = selectedSort;

      const res = await adminService.getHospitals(params);
      if (res.success) {
        setHospitals(res.hospitals || res.data || []);
      } else {
        setError(res.message || 'Unable to load hospital profiles. Please try again.');
      }
    } catch (err) {
      console.error('Error loading hospitals:', err);
      setError('Unable to load hospital profiles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [selectedStatus, selectedSort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHospitals();
  };

  // Toggle Activate / Deactivate
  const handleToggleStatus = async (hospital) => {
    try {
      const newStatus = !(hospital.isActive !== false);
      const res = await adminService.updateHospitalStatus(hospital._id, newStatus);
      if (res.success) {
        showToast(
          `Hospital account ${newStatus ? 'activated' : 'deactivated'} successfully.`,
          newStatus ? 'success' : 'info'
        );
        fetchHospitals();
      } else {
        showToast(res.message || 'Failed to update hospital status.', 'error');
      }
    } catch (err) {
      showToast('Server error updating hospital account status.', 'error');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (hospital) => {
    setEditModal({ open: true, hospital });
    setEditForm({
      name: hospital.name || '',
      phone: hospital.phone || '',
      city: hospital.city || '',
      address: hospital.address || '',
      hospitalLicenseNumber: hospital.hospitalLicenseNumber || '',
      contactPerson: hospital.contactPerson || '',
    });
  };

  // Save Edit Hospital Profile
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminService.updateHospital(editModal.hospital._id, editForm);
      if (res.success) {
        showToast('Hospital profile updated successfully.', 'success');
        setEditModal({ open: false, hospital: null });
        fetchHospitals();
      } else {
        showToast(res.message || 'Failed to update hospital profile.', 'error');
      }
    } catch (err) {
      showToast('Error updating hospital profile.', 'error');
    }
  };

  // Delete Hospital Action
  const handleDeleteHospital = async () => {
    if (!deleteModal.hospital) return;
    try {
      const res = await adminService.deleteHospital(deleteModal.hospital._id);
      if (res.success) {
        showToast('Hospital account deleted successfully.', 'success');
        setDeleteModal({ open: false, hospital: null });
        fetchHospitals();
      } else {
        showToast(res.message || 'Failed to delete hospital account.', 'error');
      }
    } catch (err) {
      showToast('Server error deleting hospital account.', 'error');
    }
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
            <FiActivity className="text-blue-600" />
            Hospital Profile Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage medical center accounts, verify licenses, and monitor real emergency blood request metrics.
          </p>
        </div>
        <button
          onClick={fetchHospitals}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh List
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-4">
          {/* Search Keyword */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search hospital by Name, Email, Phone, City..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* City Input Filter */}
          <div className="w-full lg:w-48">
            <input
              type="text"
              placeholder="Filter by City..."
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              onBlur={fetchHospitals}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
          >
            Search Hospitals
          </button>
        </form>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
            <FiFilter className="w-3.5 h-3.5 text-blue-500" /> Filters & Sort:
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-medium">Account Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Sort Option */}
          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-medium">Sort Order:</label>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
            </select>
          </div>

          {(selectedStatus !== 'all' || selectedCity || searchTerm || selectedSort !== 'newest') && (
            <button
              onClick={() => {
                setSelectedStatus('all');
                setSelectedCity('');
                setSearchTerm('');
                setSelectedSort('newest');
              }}
              className="text-blue-600 hover:text-blue-800 text-xs font-bold underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-3">
          <FiAlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Hospital Accounts Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-medium">Fetching hospital accounts from MongoDB...</p>
          </div>
        ) : hospitals.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <div className="text-3xl">🏥</div>
            <p className="text-sm font-bold text-slate-700">No hospital profiles found.</p>
            <p className="text-xs text-slate-400">Try modifying your search criteria or resetting filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Hospital Name</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4 text-center">Total Requests</th>
                  <th className="py-3.5 px-4 text-center">Pending</th>
                  <th className="py-3.5 px-4 text-center">Fulfilled</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {hospitals.map((hospital) => {
                  const isActive = hospital.isActive !== false;

                  return (
                    <tr key={hospital._id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name */}
                      <td className="py-4 px-4 font-bold text-slate-900">
                        <Link
                          to={`/admin/hospitals/${hospital._id}`}
                          className="hover:text-blue-600 transition-colors block font-bold text-sm"
                        >
                          {hospital.name}
                        </Link>
                        {hospital.contactPerson && (
                          <span className="text-[11px] text-slate-400 font-medium block">
                            Contact: {hospital.contactPerson}
                          </span>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <p className="font-medium text-slate-800">{hospital.email}</p>
                          <p className="text-[11px] text-slate-500">{hospital.phone}</p>
                        </div>
                      </td>

                      {/* City */}
                      <td className="py-4 px-4 font-medium text-slate-800">
                        {hospital.city}
                      </td>

                      {/* Total Requests */}
                      <td className="py-4 px-4 text-center font-black text-slate-900">
                        {hospital.totalBloodRequests || 0}
                      </td>

                      {/* Pending Requests */}
                      <td className="py-4 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          {hospital.pendingRequests || 0}
                        </span>
                      </td>

                      {/* Fulfilled Requests */}
                      <td className="py-4 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          {hospital.fulfilledRequests || 0}
                        </span>
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
                        {hospital.createdAt ? new Date(hospital.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/hospitals/${hospital._id}`}
                            title="View Hospital Profile"
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleOpenEdit(hospital)}
                            title="Edit Hospital Profile"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(hospital)}
                            title={isActive ? 'Deactivate Account' : 'Activate Account'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isActive
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {isActive ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => setDeleteModal({ open: true, hospital })}
                            title="Delete Hospital Account"
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

      {/* Edit Hospital Profile Modal */}
      {editModal.open && editModal.hospital && (
        <Modal
          isOpen={editModal.open}
          onClose={() => setEditModal({ open: false, hospital: null })}
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
              <label className="block font-bold text-slate-700 mb-1">Hospital Address</label>
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
                onClick={() => setEditModal({ open: false, hospital: null })}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Hospital Confirmation Modal */}
      {deleteModal.open && deleteModal.hospital && (
        <Modal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, hospital: null })}
          title="Confirm Hospital Account Deletion"
        >
          <div className="space-y-4 text-slate-700 text-xs">
            <p className="font-medium text-slate-900 text-sm">
              Are you sure you want to delete this hospital account?
            </p>
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-1">
              <p className="font-bold">Hospital: {deleteModal.hospital.name} ({deleteModal.hospital.email})</p>
              <p className="text-[11px]">
                Deleting this account will clear related blood requests and donation records from MongoDB to prevent orphaned data.
              </p>
            </div>
            <div className="pt-3 flex justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDeleteModal({ open: false, hospital: null })}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteHospital}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
              >
                Delete Hospital
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Hospitals;
