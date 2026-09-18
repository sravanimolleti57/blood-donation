import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import Toast from '../../components/Toast';
import API from '../../services/api';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiEdit3 } from 'react-icons/fi';

const DonorProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    address: user?.address || '',
    bloodGroup: user?.bloodGroup || 'O+',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || 'Male',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put('/users/profile', formData);
      setLoading(false);

      if (data.success) {
        updateUser(data.user);
        setIsEditing(false);
        setToast({ type: 'success', message: 'Profile updated successfully!' });
      }
    } catch (error) {
      setLoading(false);
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update profile.',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-full border-4 border-brand-500 object-cover"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
            <p className="text-xs text-slate-500">Registered Blood Donor Profile</p>
          </div>
        </div>

        <Button
          variant={isEditing ? 'secondary' : 'primary'}
          onClick={() => setIsEditing(!isEditing)}
          icon={isEditing ? null : FiEdit3}
        >
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Personal Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
            <FiUser className="w-5 h-5 text-brand-600" />
            <span>Personal Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400">Email address cannot be changed</span>
            </div>

            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />

            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm disabled:bg-slate-100"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Donation Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
            <FiUser className="w-5 h-5 text-brand-600" />
            <span>Donation Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Blood Group</label>
              {isEditing ? (
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm font-bold text-brand-600"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              ) : (
                <BloodGroupBadge bloodGroup={user?.bloodGroup || 'O+'} size="lg" />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</label>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${user?.available ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                {user?.available ? 'AVAILABLE TO DONATE' : 'UNAVAILABLE'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Last Donation</label>
              <span className="text-sm font-bold text-slate-900">15 August 2026</span>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
            <FiMapPin className="w-5 h-5 text-brand-600" />
            <span>Location Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-4 pt-4">
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} icon={FiSave}>
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default DonorProfile;
