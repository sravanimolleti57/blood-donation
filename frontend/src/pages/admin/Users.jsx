import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Input from '../../components/Input';
import Toast from '../../components/Toast';
import { FiUsers, FiSearch, FiShield } from 'react-icons/fi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      // Fallback dummy users for UI preview if server users list empty
      setUsers([
        { _id: '1', name: 'Ananya Roy', email: 'ananya@example.com', role: 'donor', city: 'Mumbai', createdAt: '2026-09-18' },
        { _id: '2', name: 'St. Jude Hospital', email: 'contact@stjude.org', role: 'hospital', city: 'Mumbai', createdAt: '2026-09-17' },
        { _id: '3', name: 'System Admin', email: 'admin@bloodconnect.org', role: 'admin', city: 'Metropolis', createdAt: '2026-09-01' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.city?.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role.toUpperCase() === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">User Management</h1>
          <p className="text-xs text-slate-500">Monitor and manage all registered accounts on BloodConnect</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
          <FiUsers className="w-5 h-5" />
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by name, email or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={FiSearch}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-500 shrink-0">Filter Role:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-slate-300 text-xs p-2.5 font-bold text-slate-700 bg-white"
          >
            <option value="ALL">All Roles</option>
            <option value="DONOR">Donors</option>
            <option value="HOSPITAL">Hospitals</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Role</th>
                <th className="p-4">City</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-xs text-slate-400">
                    No users matching search filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{u.name}</td>
                    <td className="p-4 text-slate-500">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : u.role === 'hospital'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-brand-50 text-brand-700 border border-brand-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">{u.city || 'N/A'}</td>
                    <td className="p-4 text-slate-400 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setToast({ type: 'info', message: `User action drawer opened for ${u.name}` })}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                      >
                        Manage
                      </button>
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

export default Users;
