import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import { FiFilePlus, FiAlertCircle } from 'react-icons/fi';

const CreateRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    bloodGroup: 'O+',
    units: 2,
    urgency: 'URGENT',
    patientName: '',
    department: 'Emergency & Trauma Care',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setToast({
        type: 'success',
        message: 'Blood Request created and broadcasted to matching donors in your city!',
      });
      setTimeout(() => {
        navigate('/hospital/requests');
      }, 1200);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Create Emergency Blood Request</h1>
          <p className="text-xs text-slate-500">Post urgent blood requirement for immediate donor notification</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <FiFilePlus className="w-5 h-5" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Required Blood Group <span className="text-brand-600">*</span>
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm font-bold text-brand-600 focus:ring-brand-500"
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
            name="units"
            type="number"
            min="1"
            max="20"
            value={formData.units}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Urgency Level <span className="text-brand-600">*</span>
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm font-bold text-red-600 focus:ring-brand-500"
              required
            >
              <option value="URGENT">🚨 URGENT (Immediate)</option>
              <option value="HIGH">⚠️ HIGH (Within 12 hours)</option>
              <option value="NORMAL">ℹ️ NORMAL (Within 24-48 hours)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Patient Name / Ref ID"
            name="patientName"
            placeholder="e.g. Patient ID #4892"
            value={formData.patientName}
            onChange={handleChange}
            required
          />

          <Input
            label="Hospital Department"
            name="department"
            placeholder="e.g. ICU / Surgery Wing"
            value={formData.department}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1.5">
            Special Instructions / Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Specify attending physician, specific ward location, or replacement policies..."
            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-brand-500 text-slate-900"
          ></textarea>
        </div>

        <div className="p-4 bg-brand-50 border border-brand-200 rounded-2xl flex items-start gap-3 text-xs text-brand-900">
          <FiAlertCircle className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          <span>
            Upon submission, this request will immediately be listed in the public portal and matched with active donors registered in your city.
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
