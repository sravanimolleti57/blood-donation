import React, { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import { FiSettings, FiSave, FiLock, FiShield } from 'react-icons/fi';

const Settings = () => {
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({
    siteName: 'BloodConnect',
    emergencyHelpline: '+91 1800-123-BLOOD',
    tokenExpiryDays: '7d',
    requireHospitalVerification: true,
    allowDonorSelfRegistration: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setToast({ type: 'success', message: 'System configuration saved successfully!' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">System Settings</h1>
          <p className="text-xs text-slate-500">Configure global parameters, security enforcement, and helplines</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
          <FiSettings className="w-5 h-5" />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
            <FiShield className="w-5 h-5 text-brand-600" />
            <span>Platform Identification & Helpline</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Application Name"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />

            <Input
              label="Emergency Helpline Number"
              value={settings.emergencyHelpline}
              onChange={(e) => setSettings({ ...settings, emergencyHelpline: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
            <FiLock className="w-5 h-5 text-brand-600" />
            <span>Security & Authentication Controls</span>
          </h2>

          <div className="space-y-4">
            <Input
              label="JWT Session Expiration Duration"
              value={settings.tokenExpiryDays}
              onChange={(e) => setSettings({ ...settings, tokenExpiryDays: e.target.value })}
              helperText="Configured via JWT_EXPIRES_IN in backend .env"
            />

            <div className="pt-2 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={settings.requireHospitalVerification}
                  onChange={(e) => setSettings({ ...settings, requireHospitalVerification: e.target.checked })}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span>Mandatory Admin Verification for Hospital Emergency Broadcasts</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={settings.allowDonorSelfRegistration}
                  onChange={(e) => setSettings({ ...settings, allowDonorSelfRegistration: e.target.checked })}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span>Enable Open Public Donor Registration</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" icon={FiSave}>
            Save System Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
