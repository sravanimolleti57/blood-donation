import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import API from '../../services/api';
import { FiFilePlus, FiAlertCircle } from 'react-icons/fi';

const CreateRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    hospitalName: user?.name || '',
    bloodGroup: 'O+',
    unitsRequired: 2,
    urgency: 'urgent',
    city: user?.city || '',
    hospitalAddress: user?.address || '',
    requiredDate: new Date().toISOString().split('T')[0],
    contactPhone: user?.phone || '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post('/blood-requests', {
        hospitalName: formData.hospitalName || user?.name || 'Hospital Facility',
        bloodGroup: formData.bloodGroup,
        unitsRequired: Number(formData.unitsRequired),
        urgency: formData.urgency.toLowerCase(),
        city: formData.city || user?.city || 'City Center',
        hospitalAddress: formData.hospitalAddress || user?.address || 'Hospital Address',
        requiredDate: formData.requiredDate,
        contactPhone: formData.contactPhone || user?.phone || '9876543210',
        description: formData.description,
      });

      if (data.success) {
        setToast({
          type: 'success',
          message: 'Blood request created and saved into MongoDB Atlas!',
        });
        setTimeout(() => {
          navigate('/hospital/requests');
        }, 1200);
      }
    } catch (error) {
      console.error('Create request error:', error);
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create blood request.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Create Emergency Blood Request</h1>
          <p className="text-xs text-slate-500">Post urgent blood requirement directly to MongoDB Atlas</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
          <FiFilePlus className="w-5 h-5" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Hospital Name"
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleChange}
            required
          />

          <Input
            label="Contact Phone Number"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Required Blood Group <span className="text-red-600">*</span>
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm font-bold text-red-600 focus:ring-red-500"
              required
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
          </div>

          <Input
            label="Required Units"
            name="unitsRequired"
            type="number"
            min="1"
            max="50"
            value={formData.unitsRequired}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Urgency Level <span className="text-red-600">*</span>
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm font-bold text-red-600 focus:ring-red-500"
              required
            >
              <option value="critical">🚨 CRITICAL (Immediate)</option>
              <option value="urgent">⚠️ URGENT (Within 12 hours)</option>
              <option value="normal">ℹ️ NORMAL (Standard schedule)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <Input
            label="Required Date"
            name="requiredDate"
            type="date"
            value={formData.requiredDate}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Hospital Full Address"
          name="hospitalAddress"
          value={formData.hospitalAddress}
          onChange={handleChange}
          required
        />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
            Special Instructions / Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Specify room number, attending doctor name, or urgency details..."
            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-red-500 text-slate-900"
          ></textarea>
        </div>

        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-red-900">
          <FiAlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span>
            Upon submission, this request will immediately be stored in MongoDB Atlas and listed for compatible donors.
          </span>
        </div>

        <div className="flex justify-end gap-4 pt-2">
          <Button variant="secondary" onClick={() => navigate('/hospital/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} icon={FiFilePlus}>
            Publish Blood Request
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequest;
