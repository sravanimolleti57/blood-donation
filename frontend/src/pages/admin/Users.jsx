import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Input from '../../components/Input';
import Toast from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import {
  FiUsers,
  FiSearch,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiX,
  FiShield,
} from 'react-icons/fi';

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState(null);

  // Modal states
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/users', {
        params: {
          role: roleFilter,
          status: statusFilter,
          search: search || undefined,
        },
      });

      if (data.success) {
        setUsers(data.users || data.data || []);
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load user accounts from database.',
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  // Toggle user status (Activate / Deactivate)
  const handleToggleStatus = async (userToToggle) => {
    const newStatus = userToToggle.isActive === false;
    setActionLoading(true);
    try {
      const { data } = await API.patch(`/admin/users/${userToToggle._id}/status`, {
        isActive: newStatus,
      });

      if (data.success) {
        setToast({
          type: 'success',
          message: data.message || `Account ${newStatus ? 'activated' : 'deactivated'} successfully.`,
        });
        fetchUsers();
        if (viewUser && viewUser._id === userToToggle._id) {
          setViewUser(data.user);
        }
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update account status.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Save edit user
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const { data } = await API.put(`/admin/users/${editUser._id}`, editUser);
      if (data.success) {
        setToast({
          type: 'success',
          message: 'User account updated successfully.',
        });
        setEditUser(null);
        fetchUsers();
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update user account.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    setActionLoading(true);
    try {
      const { data } = await API.delete(`/admin/users/${deleteConfirmUser._id}`);
      if (data.success) {
        setToast({
          type: 'success',
          message: 'User account deleted successfully.',
        });
        setDeleteConfirmUser(null);
        fetchUsers();
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete user account.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.phone?.toLowerCase().includes(term) ||
      u.city?.toLowerCase().includes(term) ||
      u.bloodGroup?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">User Management</h1>
          <p className="text-xs text-slate-500">
            View, edit, activate/deactivate, and manage registered accounts in MongoDB Atlas
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
          <FiUsers className="w-6 h-6" />
        </div>
      </div>

      {/* Filter and Search Controls */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search name, email, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={FiSearch}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 shrink-0">Role:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-slate-200 text-xs p-2.5 font-bold text-slate-700 bg-slate-50 focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="donor">Donors</option>
              <option value="hospital">Hospitals</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 shrink-0">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 text-xs p-2.5 font-bold text-slate-700 bg-slate-50 focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Deactivated</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">City</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-xs text-slate-400">
                    Loading users from database...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-xs text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors text-xs">
                    <td className="p-4 font-bold text-slate-900">{u.name}</td>
                    <td className="p-4 text-slate-500">{u.email}</td>
                    <td className="p-4 text-slate-600">{u.phone || 'N/A'}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : u.role === 'hospital'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-red-600">{u.bloodGroup || '-'}</td>
                    <td className="p-4 text-slate-600">{u.city || 'N/A'}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-300'
                        }`}
                      >
                        {u.isActive !== false ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* View Details */}
                        <button
                          title="View Details"
                          onClick={() => setViewUser(u)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          title="Edit User"
                          onClick={() => setEditUser({ ...u })}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>

                        {/* Activate/Deactivate */}
                        <button
                          title={u.isActive !== false ? 'Deactivate User' : 'Activate User'}
                          onClick={() => handleToggleStatus(u)}
                          disabled={actionLoading}
                          className={`p-1.5 rounded-lg transition-colors ${
                            u.isActive !== false
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {u.isActive !== false ? (
                            <FiXCircle className="w-4 h-4" />
                          ) : (
                            <FiCheckCircle className="w-4 h-4" />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          title="Delete User"
                          onClick={() => setDeleteConfirmUser(u)}
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

      {/* VIEW USER DETAILS MODAL */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">User Account Details</h3>
                <p className="text-xs text-slate-400">Database Record ID: {viewUser._id}</p>
              </div>
              <button
                onClick={() => setViewUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Full Name</span>
                  <p className="font-bold text-slate-900">{viewUser.name}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Email Address</span>
                  <p className="font-bold text-slate-900 break-all">{viewUser.email}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Phone Number</span>
                  <p className="font-bold text-slate-900">{viewUser.phone || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Account Role</span>
                  <p className="font-bold text-slate-900 uppercase">{viewUser.role}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Blood Group</span>
                  <p className="font-bold text-red-600">{viewUser.bloodGroup || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">City / Location</span>
                  <p className="font-bold text-slate-900">{viewUser.city || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Donor Availability</span>
                  <p className="font-bold text-slate-900">
                    {viewUser.available !== false ? 'Available' : 'Unavailable'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Account Status</span>
                  <p
                    className={`font-bold ${
                      viewUser.isActive !== false ? 'text-emerald-600' : 'text-slate-500'
                    }`}
                  >
                    {viewUser.isActive !== false ? 'ACTIVE' : 'DEACTIVATED'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Address</span>
                  <p className="font-medium text-slate-800">{viewUser.address || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Registered Date</span>
                  <p className="font-medium text-slate-700">
                    {viewUser.createdAt ? new Date(viewUser.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Last Login Date</span>
                  <p className="font-medium text-slate-700">
                    {viewUser.lastLoginAt ? new Date(viewUser.lastLoginAt).toLocaleString() : 'Never logged in'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 flex items-center gap-2">
                <FiShield className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Security Notice: User passwords and authentication secrets are encrypted and never exposed to the frontend.</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 flex justify-end">
              <button
                onClick={() => setViewUser(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl font-medium text-xs hover:bg-slate-800"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <h3 className="text-lg font-bold">Edit User Account</h3>
              <button
                onClick={() => setEditUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editUser.name || ''}
                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editUser.phone || ''}
                    onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Role</label>
                  <select
                    value={editUser.role || 'donor'}
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500"
                  >
                    <option value="donor">Donor</option>
                    <option value="hospital">Hospital</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
                  <select
                    value={editUser.bloodGroup || ''}
                    onChange={(e) => setEditUser({ ...editUser, bloodGroup: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">N/A</option>
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
                <div>
                  <label className="block text-slate-700 font-bold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={editUser.city || ''}
                    onChange={(e) => setEditUser({ ...editUser, city: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Account Active</label>
                  <select
                    value={editUser.isActive !== false ? 'true' : 'false'}
                    onChange={(e) => setEditUser({ ...editUser, isActive: e.target.value === 'true' })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Deactivated</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"
                >
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <FiAlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Confirm Account Deletion</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete the user account for{' '}
                <strong className="text-slate-900">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-xs hover:bg-red-700"
              >
                {actionLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
