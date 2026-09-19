import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import Toast from '../../components/Toast';
import {
  FiArrowLeft,
  FiUser,
  FiDroplet,
  FiActivity,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiClock,
  FiCalendar,
  FiMapPin,
  FiFileText,
} from 'react-icons/fi';

const DonorResponseReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchResponseDetails();
  }, [id]);

  const fetchResponseDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/admin/donor-responses/${id}`);
      if (data.success) {
        setResponse(data.donorResponse || data.data);
      } else {
        setError(data.message || 'Donor response record not found.');
      }
    } catch (err) {
      console.error('Error fetching donor response review details:', err);
      setError('Unable to load donor response details for review.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setSubmitting(true);
    try {
      const { data } = await API.patch(`/admin/donor-responses/${id}/approve`, {
        adminNotes,
      });
      if (data.success) {
        setToast({
          type: 'success',
          message: 'Donor response APPROVED! Blood request marked as FULFILLED and CLOSED.',
        });
        setTimeout(() => navigate('/admin/donor-responses'), 1500);
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to accept donor response.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    setSubmitting(true);
    try {
      const { data } = await API.patch(`/admin/donor-responses/${id}/reject`, {
        adminNotes,
      });
      if (data.success) {
        setToast({
          type: 'info',
          message: 'Donor response REJECTED. Emergency request remains active for other donors.',
        });
        setTimeout(() => navigate('/admin/donors'), 1500);
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to reject donor response.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 space-y-3">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold">Loading donor response for admin review...</p>
      </div>
    );
  }

  if (error || !response) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/admin/donors')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <FiArrowLeft /> Back to Donor Directory
        </button>
        <div className="p-8 bg-red-50 border border-red-200 rounded-3xl text-red-700 text-sm flex items-center gap-3">
          <FiAlertCircle className="w-6 h-6 shrink-0 text-red-500" />
          <span>{error || 'Response record not found.'}</span>
        </div>
      </div>
    );
  }

  const donor = response.donor || {};
  const bloodReq = response.request || {};
  const calc = response.calculatedEligibility || {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/donors')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-red-600 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to Donor Management
        </button>

        <span
          className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
            response.status === 'accepted'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : response.status === 'rejected'
              ? 'bg-rose-100 text-rose-800 border border-rose-200'
              : 'bg-amber-100 text-amber-800 border border-amber-200'
          }`}
        >
          RESPONSE STATUS: {response.status}
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex items-center justify-between border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black">Donor Response Verification & Review</h1>
            <BloodGroupBadge bloodGroup={response.bloodGroup} />
          </div>
          <p className="text-xs text-slate-300">
            Submitted by <span className="font-bold text-white">{donor.name || 'Donor'}</span> for hospital request{' '}
            <span className="font-bold text-red-400">{bloodReq.hospitalName}</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-red-500 flex items-center justify-center text-2xl border border-slate-700 shrink-0">
          📋
        </div>
      </div>

      {/* Main Review Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. DONOR INFORMATION */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiUser className="text-red-600" /> Donor Information
          </h2>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Full Name:</span>
              <span className="font-bold text-slate-900">{donor.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Email Address:</span>
              <span className="font-bold text-slate-900">{donor.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Phone Number:</span>
              <span className="font-bold text-slate-900">{response.phone || donor.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Age:</span>
              <span className="font-bold text-slate-900">{response.age} Years</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Weight:</span>
              <span className="font-bold text-slate-900">{response.weight} kg</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Blood Group:</span>
              <span className="font-bold text-red-600">{response.bloodGroup}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">City:</span>
              <span className="font-bold text-slate-900">{response.city || donor.city}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Availability:</span>
              <span className={`font-bold ${calc.isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
                {calc.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. DONATION INFORMATION */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiClock className="text-blue-600" /> Donation Information
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Last Donation Date:</span>
              <span className="font-bold text-slate-900">
                {response.lastDonationDate
                  ? new Date(response.lastDonationDate).toLocaleDateString()
                  : 'First-time Donor (No previous record)'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Months Since Last Donation:</span>
              <span className="font-bold text-slate-900">
                {response.monthsSinceLastDonation !== null
                  ? `${response.monthsSinceLastDonation} Month(s)`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">6-Month Rule Status:</span>
              <span className={`font-bold ${calc.isIntervalEligible ? 'text-emerald-600' : 'text-rose-600'}`}>
                {calc.isIntervalEligible
                  ? 'Eligible (≥ 6 months / First-time)'
                  : `Ineligible (< 6 months interval)`}
              </span>
            </div>
          </div>
        </div>

        {/* 3. BLOOD REQUEST INFORMATION */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiActivity className="text-amber-600" /> Target Blood Request
          </h2>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Hospital Facility:</span>
              <span className="font-bold text-slate-900">{bloodReq.hospitalName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Blood Group Required:</span>
              <span className="font-bold text-red-600">{bloodReq.bloodGroup}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Units Needed:</span>
              <span className="font-bold text-slate-900">{bloodReq.unitsRequired} Unit(s)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Urgency:</span>
              <span className="font-bold uppercase text-red-600">{bloodReq.urgency}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">City:</span>
              <span className="font-bold text-slate-900">{bloodReq.city}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Hospital Address:</span>
              <span className="font-semibold text-slate-800">{bloodReq.hospitalAddress}</span>
            </div>
          </div>
        </div>

        {/* 4. SOFTWARE ELIGIBILITY CHECKLIST */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiShield className="text-purple-600" /> Project Eligibility Verification
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span>Age Check (18–65 yrs):</span>
              {calc.isAgeEligible ? (
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <FiCheckCircle /> Passed ({response.age} yrs)
                </span>
              ) : (
                <span className="font-bold text-rose-600 flex items-center gap-1">
                  <FiXCircle /> Failed ({response.age} yrs)
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span>Weight Check (≥ 45 kg):</span>
              {calc.isWeightEligible ? (
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <FiCheckCircle /> Passed ({response.weight} kg)
                </span>
              ) : (
                <span className="font-bold text-rose-600 flex items-center gap-1">
                  <FiXCircle /> Failed ({response.weight} kg)
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span>Blood Group Compatibility:</span>
              {calc.isBloodGroupCompatible ? (
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <FiCheckCircle /> Compatible ({response.bloodGroup})
                </span>
              ) : (
                <span className="font-bold text-rose-600 flex items-center gap-1">
                  <FiXCircle /> Incompatible
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span>6-Month Donation Rule:</span>
              {calc.isIntervalEligible ? (
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <FiCheckCircle /> Passed
                </span>
              ) : (
                <span className="font-bold text-rose-600 flex items-center gap-1">
                  <FiXCircle /> Failed (&lt; 6 months)
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <span>Health Declaration:</span>
              {response.healthDeclaration ? (
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <FiCheckCircle /> Confirmed
                </span>
              ) : (
                <span className="font-bold text-rose-600 flex items-center gap-1">
                  <FiXCircle /> Missing
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Notes & Decision Action Section */}
      {response.status === 'pending' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Admin Final Acceptance Decision</h2>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admin Notes / Verification Decision Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add optional notes for the donor or hospital record..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              onClick={handleReject}
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl text-xs font-bold transition-all border border-rose-200"
            >
              REJECT RESPONSE
            </button>

            <button
              onClick={handleAccept}
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md"
            >
              {submitting ? 'Processing Approval...' : 'APPROVE DONATION'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorResponseReview;
