import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { FiMail, FiHeart, FiCheckCircle } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ type: 'error', message: 'Please enter both email and password.' });
      return;
    }

    setLoading(true);
    setToast(null);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      setToast({ type: 'success', message: 'Login successful! Redirecting...' });
      
      setTimeout(() => {
        if (from) {
          navigate(from, { replace: true });
        } else if (result.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (result.role === 'hospital') {
          navigate('/hospital/dashboard', { replace: true });
        } else {
          navigate('/donor/dashboard', { replace: true });
        }
      }, 500);
    } else {
      setToast({ type: 'error', message: result.message || 'Invalid email or password.' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Branding Visual Column */}
        <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-red-700 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-4 relative z-10">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white text-brand-700 flex items-center justify-center font-bold text-xl shadow-md">
                🩸
              </div>
              <span className="text-2xl font-extrabold tracking-tight">BloodConnect</span>
            </Link>
            <p className="text-brand-100 text-sm italic">"Every Drop Can Save a Life"</p>
          </div>

          <div className="space-y-6 relative z-10 my-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Saving lives starts with a single click.</h3>
              <p className="text-xs text-brand-100 leading-relaxed">
                Log in to access your donor dashboard, update availability status, or manage critical hospital blood requests.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 text-emerald-300" />
                <span>Verified Hospital Emergency Network</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 text-emerald-300" />
                <span>Encrypted JWT & Password Security</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 text-emerald-300" />
                <span>24/7 Community Blood Matching</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-brand-200 border-t border-white/15 pt-4">
            Need urgent assistance? Call toll-free 1800-123-BLOOD.
          </div>
        </div>

        {/* Right Form Column */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900">Welcome Back</h2>
            <p className="text-xs text-slate-500">Sign in to continue to BloodConnect</p>
          </div>

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

            <PasswordInput
              label="Password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>Remember me</span>
              </label>

              <Link to="/forgot-password" className="font-semibold text-brand-600 hover:text-brand-700">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              className="mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center border-t border-slate-100 pt-6 text-xs text-slate-600 space-y-3">
            <div>
              <span>Don't have an account? </span>
              <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 underline">
                Create Account
              </Link>
            </div>
            
            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-xs"
              >
                <span>🛡️</span>
                <span>Admin Portal Login</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
