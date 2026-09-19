import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import Button from '../components/Button';
import Toast from '../components/Toast';
import RoleOrbit from '../components/RoleOrbit';
import { FiMail, FiCheckCircle } from 'react-icons/fi';

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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-950/5 relative overflow-hidden">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* Left Visual Column with 3D Circular Role Orbit */}
        <div className="lg:col-span-6 bg-slate-950 text-white p-8 flex flex-col justify-between relative overflow-hidden border-r border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header */}
          <div className="space-y-2 relative z-10">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-red-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                🩸
              </div>
              <span className="text-2xl font-black tracking-tight text-white">BloodConnect</span>
            </Link>
            <p className="text-xs text-slate-400 font-light">
              Select your role or sign in directly to continue
            </p>
          </div>

          {/* 3D CIRCULAR ROLE ORBIT COMPONENT */}
          <div className="my-4 relative z-10 flex items-center justify-center">
            <RoleOrbit />
          </div>

          {/* Footer note */}
          <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 relative z-10 flex items-center justify-between">
            <span>24/7 Emergency Blood Network</span>
            <span className="text-brand-400 font-mono font-medium">Verified Security</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-6 bg-white">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-xs sm:text-sm text-slate-500">Sign in to access your BloodConnect portal</p>
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
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>Remember me</span>
              </label>

              <Link to="/forgot-password" className="font-bold text-brand-600 hover:text-brand-700">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              className="mt-2 shadow-md hover:shadow-brand-500/20"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center border-t border-slate-100 pt-6 text-xs text-slate-600 space-y-3">
            <div>
              <span>Don't have an account? </span>
              <Link to="/register" className="font-extrabold text-brand-600 hover:text-brand-700 underline">
                Create Account
              </Link>
            </div>
            
            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-xs"
              >
                <span>🔐</span>
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
