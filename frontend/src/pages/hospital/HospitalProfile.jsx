import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import API from '../../services/api';
import { FiActivity, FiSave, FiEdit3, FiShield, FiClock } from 'react-icons/fi';

const HospitalProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    contactPerson: user?.contactPerson || '',
    phone: user?.phone || '',
    city: user?.city || '',
    address: user?.address || '',
    hospitalLicenseNumber: user?.hospitalLicenseNumber || '',
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
        setToast({ type: 'success', message: 'Hospital profile updated successfully!' });
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
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-3xl font-bold border border-brand-200">
            🏥
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${user?.verified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                {user?.verified ? 'Verified Hospital' : 'Pending Verification'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Official Healthcare Facility & Blood Center</p>
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
        
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
            <FiActivity className="w-5 h-5 text-brand-600" />
            <span>Hospital Registration Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Hospital Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />

            <Input
              label="Contact Person Name"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Official Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400">Email cannot be changed</span>
            </div>

            <Input
              label="Contact Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />

            <Input
              label="License / Medical Registration Number"
              name="hospitalLicenseNumber"
              value={formData.hospitalLicenseNumber}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />

            <div className="flex flex-col justify-center">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Verification Status</label>
              <div className="flex items-center gap-2">
                {user?.verified ? (
                  <span className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                    <FiShield className="w-4 h-4 text-emerald-600" /> Fully Verified by System Admin
                  </span>
                ) : (
                  <span className="text-sm font-bold text-amber-700 flex items-center gap-1">
                    <FiClock className="w-4 h-4 text-amber-600" /> Under Admin Review
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3">Facility Location</h2>

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
              label="Full Facility Address"
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
              Save Hospital Details
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default HospitalProfile;
