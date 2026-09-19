import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import HowItWorks from './pages/HowItWorks';
import NotFound from './pages/NotFound';

// Donor Pages
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorProfile from './pages/donor/DonorProfile';
import DonationHistory from './pages/donor/DonationHistory';
import DonorRequests from './pages/donor/DonorRequests';

// Hospital Pages
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import HospitalProfile from './pages/hospital/HospitalProfile';
import CreateRequest from './pages/hospital/CreateRequest';
import HospitalRequests from './pages/hospital/HospitalRequests';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import Donors from './pages/admin/Donors';
import DonorProfileView from './pages/admin/DonorProfileView';
import Hospitals from './pages/admin/Hospitals';
import HospitalProfileView from './pages/admin/HospitalProfileView';
import Requests from './pages/admin/Requests';
import AdminDonations from './pages/admin/AdminDonations';
import AdminManagement from './pages/admin/AdminManagement';
import DonorResponseReview from './pages/admin/DonorResponseReview';
import Settings from './pages/admin/Settings';

// Layout wrapper for Portal pages (with sidebar) vs Public pages
const LayoutWrapper = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isPortalRoute =
    location.pathname.startsWith('/donor') ||
    location.pathname.startsWith('/hospital') ||
    location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      
      {isPortalRoute && isAuthenticated ? (
        <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
          <Sidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      ) : (
        <main className="flex-1">{children}</main>
      )}

      <Footer />
    </div>
  );
};

function AppRoutes() {
  return (
    <LayoutWrapper>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Donor Routes */}
        <Route
          path="/donor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['donor']}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/profile"
          element={
            <ProtectedRoute allowedRoles={['donor']}>
              <DonorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/history"
          element={
            <ProtectedRoute allowedRoles={['donor']}>
              <DonationHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/requests"
          element={
            <ProtectedRoute allowedRoles={['donor']}>
              <DonorRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/blood-requests/:requestId/respond"
          element={
            <ProtectedRoute allowedRoles={['donor']}>
              <DonorRequests />
            </ProtectedRoute>
          }
        />

        {/* Protected Hospital Routes */}
        <Route
          path="/hospital/dashboard"
          element={
            <ProtectedRoute allowedRoles={['hospital']}>
              <HospitalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital/profile"
          element={
            <ProtectedRoute allowedRoles={['hospital']}>
              <HospitalProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital/create-request"
          element={
            <ProtectedRoute allowedRoles={['hospital']}>
              <CreateRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital/requests"
          element={
            <ProtectedRoute allowedRoles={['hospital']}>
              <HospitalRequests />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/donors"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Donors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/donors/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DonorProfileView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hospitals"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Hospitals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hospitals/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <HospitalProfileView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Requests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blood-requests"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Requests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/donor-responses"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Requests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/donations"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDonations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/management"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/donor-responses/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DonorResponseReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </LayoutWrapper>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
