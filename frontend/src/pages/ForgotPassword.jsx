import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/Toast';
import API from '../services/api';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setToast({ type: 'error', message: 'Please enter your registered email address.' });
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post('/auth/forgot-password', { email });
      setLoading(false);
      setSubmitted(true);
      setToast({
        type: 'info',
        message: data.message || 'If the email exists, password reset instructions will be sent.',
      });
    } catch (error) {
      setLoading(false);
      setSubmitted(true);
      setToast({
        type: 'info',
        message: 'If the email exists, password reset instructions will be sent.',
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors">
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900">Forgot Password?</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Enter your registered email address below and we will send password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-3 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-bold">
              ✓
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Request Submitted</h4>
            <p className="leading-relaxed text-slate-600">
              If an account with email <span className="font-semibold">{email}</span> exists in our system, password reset instructions have been dispatched.
            </p>
            <Link to="/login" className="block pt-2">
              <Button size="sm" fullWidth variant="outline">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={FiMail}
              required
            />

            <Button type="submit" loading={loading} fullWidth size="lg">
              Send Reset Link
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
