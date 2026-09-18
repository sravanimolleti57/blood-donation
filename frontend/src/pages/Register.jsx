import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import Button from '../components/Button';
import Toast from '../components/Toast';
import BloodGroupBadge from '../components/BloodGroupBadge';
import { validateDonorRegistration, validateHospitalRegistration } from '../utils/validation';
import { FiUser, FiActivity, FiMail, FiPhone, FiMapPin, FiCheckCircle } from 'react-icons/fi';

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'hospital' ? 'hospital' : 'donor';
  
  const [role, setRole] = useState(initialRole);
  const [step, setStep] = useState(1); // 1 = Role selection, 2 = Form

  // Donor form state
  const [donorForm, setDonorForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bloodGroup: '',
    dateOfBirth: '',
    gender: 'Male',
    city: '',
    address: '',
    agreeToTerms: false,
  });

  // Hospital form state
  const [hospitalForm, setHospitalForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    address: '',
    hospitalLicenseNumber: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleDonorChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonorForm({
      ...donorForm,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleHospitalChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHospitalForm({
      ...hospitalForm,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setToast(null);

    let validationResult;
    let payload;

    if (role === 'donor') {
      validationResult = validateDonorRegistration(donorForm);
      payload = { ...donorForm, role: 'donor' };
    } else {
      validationResult = validateHospitalRegistration(hospitalForm);
      payload = { ...hospitalForm, role: 'hospital' };
    }

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      setToast({
        type: 'error',
        message: 'Please resolve the highlighted validation errors before submitting.',
      });
      return;
    }

    setLoading(true);

    const result = await register(payload);
    setLoading(false);

    if (result.success) {
      setToast({
        type: 'success',
        message: result.message,
      });

      setTimeout(() => {
        if (result.role === 'hospital') {
          navigate('/hospital/dashboard');
        } else {
          navigate('/donor/dashboard');
        }
      }, 1000);
    } else {
      setToast({
        type: 'error',
        message: result.message || 'Registration failed.',
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-200">
            🩸 Join BloodConnect Network
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Create Your Account</h1>
          <p className="text-xs text-slate-500">
            Sign up to connect, donate, or request blood when lives are on the line.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-4 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setRole('donor');
              setErrors({});
            }}
            className={`flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-sm transition-all ${
              role === 'donor'
                ? 'bg-white text-brand-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiUser className="w-5 h-5" />
            <span>Blood Donor</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('hospital');
              setErrors({});
            }}
            className={`flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-sm transition-all ${
              role === 'hospital'
                ? 'bg-white text-brand-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiActivity className="w-5 h-5" />
            <span>Hospital / Blood Bank</span>
          </button>
        </div>

        {/* DONOR REGISTRATION FORM */}
        {role === 'donor' && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                placeholder="e.g. Ananya Roy"
                value={donorForm.name}
                onChange={handleDonorChange}
                error={errors.name}
                required
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="ananya@example.com"
                value={donorForm.email}
                onChange={handleDonorChange}
                error={errors.email}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                name="phone"
                placeholder="10-digit mobile"
                value={donorForm.phone}
                onChange={handleDonorChange}
                error={errors.phone}
                helperText="Indian mobile format (10 digits)"
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Blood Group <span className="text-brand-600">*</span>
                </label>
                <select
                  name="bloodGroup"
                  value={donorForm.bloodGroup}
                  onChange={handleDonorChange}
                  className={`w-full rounded-lg border text-sm p-2.5 ${
                    errors.bloodGroup ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                  }`}
                  required
                >
                  <option value="">-- Select Blood Group --</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                {errors.bloodGroup && <p className="text-xs text-red-600 mt-1">{errors.bloodGroup}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordInput
                label="Password"
                name="password"
                value={donorForm.password}
                onChange={handleDonorChange}
                error={errors.password}
                required
              />

              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                value={donorForm.confirmPassword}
                onChange={handleDonorChange}
                error={errors.confirmPassword}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={donorForm.dateOfBirth}
                onChange={handleDonorChange}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                <select
                  name="gender"
                  value={donorForm.gender}
                  onChange={handleDonorChange}
                  className="w-full rounded-lg border border-slate-300 text-sm p-2.5"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                placeholder="e.g. Mumbai"
                value={donorForm.city}
                onChange={handleDonorChange}
                error={errors.city}
                required
              />

              <Input
                label="Full Residential Address"
                name="address"
                placeholder="Street address & area"
                value={donorForm.address}
                onChange={handleDonorChange}
                error={errors.address}
                required
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={donorForm.agreeToTerms}
                  onChange={handleDonorChange}
                  className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>
                  I agree to the <Link to="/about#terms" className="text-brand-600 underline">Terms</Link> and <Link to="/about#privacy" className="text-brand-600 underline">Privacy Policy</Link>. I confirm that I am eligible to donate blood.
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-xs text-red-600 mt-1 font-medium">{errors.agreeToTerms}</p>}
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg">
              Create Donor Account
            </Button>
          </form>
        )}

        {/* HOSPITAL REGISTRATION FORM */}
        {role === 'hospital' && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Note: Hospital accounts require admin verification before issuing blood requests.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Hospital / Blood Bank Name"
                name="name"
                placeholder="e.g. St. Jude Hospital"
                value={hospitalForm.name}
                onChange={handleHospitalChange}
                error={errors.name}
                required
              />

              <Input
                label="Contact Person Name"
                name="contactPerson"
                placeholder="e.g. Dr. Rajesh Sharma"
                value={hospitalForm.contactPerson}
                onChange={handleHospitalChange}
                error={errors.contactPerson}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Official Email Address"
                name="email"
                type="email"
                placeholder="hospital@domain.org"
                value={hospitalForm.email}
                onChange={handleHospitalChange}
                error={errors.email}
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                placeholder="10-digit phone"
                value={hospitalForm.phone}
                onChange={handleHospitalChange}
                error={errors.phone}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordInput
                label="Password"
                name="password"
                value={hospitalForm.password}
                onChange={handleHospitalChange}
                error={errors.password}
                required
              />

              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                value={hospitalForm.confirmPassword}
                onChange={handleHospitalChange}
                error={errors.confirmPassword}
                required
              />
            </div>

            <Input
              label="License / Medical Registration Number"
              name="hospitalLicenseNumber"
              placeholder="e.g. REG-HOSP-2026-8890"
              value={hospitalForm.hospitalLicenseNumber}
              onChange={handleHospitalChange}
              error={errors.hospitalLicenseNumber}
              helperText="Official medical council or state licensing ID"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                placeholder="e.g. New Delhi"
                value={hospitalForm.city}
                onChange={handleHospitalChange}
                error={errors.city}
                required
              />

              <Input
                label="Full Hospital Address"
                name="address"
                placeholder="Building, Street, Landmark"
                value={hospitalForm.address}
                onChange={handleHospitalChange}
                error={errors.address}
                required
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={hospitalForm.agreeToTerms}
                  onChange={handleHospitalChange}
                  className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>
                  I agree to the <Link to="/about#terms" className="text-brand-600 underline">Terms</Link> and <Link to="/about#privacy" className="text-brand-600 underline">Privacy Policy</Link>. I confirm that this is an authorized healthcare facility.
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-xs text-red-600 mt-1 font-medium">{errors.agreeToTerms}</p>}
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg">
              Register Hospital Account
            </Button>
          </form>
        )}

        {/* Bottom Link */}
        <div className="text-center border-t border-slate-100 pt-6 text-xs text-slate-600">
          <span>Already registered? </span>
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
