import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import {
  FiDroplet,
  FiMapPin,
  FiClock,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from 'react-icons/fi';

const DonorRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [myResponses, setMyResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Response Form Modal state
  const [respondModal, setRespondModal] = useState({ open: false, request: null });
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    age: '',
    weight: '',
    lastDonationDate: '',
    monthsSinceLastDonation: '',
    bloodGroup: '',
    availability: true,
    city: '',
    phone: '',
    healthDeclaration: true,
    additionalNotes: '',
  });

  useEffect(() => {
    fetchRequestsAndResponses();
  }, [user]);

  const fetchRequestsAndResponses = async () => {
    setLoading(true);
    try {
      const [reqRes, myRespRes] = await Promise.all([
        API.get('/blood-requests?activeOnly=true'),
        API.get('/my-responses'),
      ]);

      let userResponses = [];
      if (myRespRes.data.success) {
        userResponses = myRespRes.data.responses || myRespRes.data.data || [];
        setMyResponses(userResponses);
      }

      if (reqRes.data.success) {
        const list = reqRes.data.bloodRequests || reqRes.data.data || [];
        // Filter out fulfilled, cancelled, or requests where donor response is approved/accepted
        const activeList = list.filter((r) => {
          if (r.status === 'fulfilled' || r.status === 'cancelled') return false;

          const existingResp = userResponses.find((resp) => {
            const respReqId = resp.request?._id ? resp.request._id.toString() : resp.request?.toString();
            const currentReqId = r._id ? r._id.toString() : r.toString();
            return respReqId === currentReqId;
          });

          if (existingResp && (existingResp.status === 'approved' || existingResp.status === 'accepted')) {
            return false;
          }

          return true;
        });
        setRequests(activeList);
      }
    } catch (error) {
      console.error('Error fetching blood requests or responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRespondModal = (reqItem) => {
    setRespondModal({ open: true, request: reqItem });
    setForm({
      age: user?.dateOfBirth ? getAgeFromDob(user.dateOfBirth) : '',
      weight: '65',
      lastDonationDate: '',
      monthsSinceLastDonation: '',
      bloodGroup: user?.bloodGroup || reqItem.bloodGroup || 'A+',
      availability: user?.available !== false,
      city: user?.city || reqItem.city || '',
      phone: user?.phone || '',
      healthDeclaration: true,
      additionalNotes: '',
    });
  };

  const getAgeFromDob = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return '';
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age > 0 ? String(age) : '';
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!respondModal.request) return;

    setSubmitting(true);
    try {
      const { data } = await API.post(
        `/blood-requests/${respondModal.request._id}/respond`,
        form
      );
      if (data.success) {
        setToast({
          type: 'success',
          message: data.message || 'Response submitted for admin review',
        });
        setRespondModal({ open: false, request: null });
        fetchRequestsAndResponses();
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to submit response.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Active Emergency Blood Requests</h1>
          <p className="text-xs text-slate-500 mt-1">
            Urgent blood requirements submitted by verified hospitals. Respond to submit your eligibility data for admin review.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shrink-0">
          <FiDroplet className="w-6 h-6" />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 space-y-2">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p>Loading active blood requests from MongoDB...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 text-sm space-y-2">
          <div className="text-3xl">🩸</div>
          <p className="font-bold text-slate-800">No active blood requests available.</p>
          <p className="text-xs text-slate-400">All pending emergency requests have been fulfilled or closed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => {
            const existingResponse = myResponses.find((r) => {
              const respReqId = r.request?._id ? r.request._id.toString() : r.request?.toString();
              const currentReqId = req._id ? req._id.toString() : req.toString();
              return respReqId === currentReqId;
            });

            return (
              <div
                key={req._id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      URGENCY:
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        req.urgency === 'critical'
                          ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse'
                          : req.urgency === 'urgent'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {req.urgency}
                    </span>
                  </div>

                  <div className="pt-1">
                    <h3 className="text-base font-bold text-slate-900">{req.hospitalName}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <FiMapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      {req.hospitalAddress}, {req.city}
                    </p>
                    {req.contactPhone && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <FiPhone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        Contact: {req.contactPhone}
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Required Group</span>
                      <BloodGroupBadge bloodGroup={req.bloodGroup} size="md" />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Units Needed</span>
                      <span className="text-sm font-bold text-slate-900">{req.unitsRequired} Unit(s)</span>
                    </div>
                  </div>

                  {req.description && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                      "{req.description}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3.5 h-3.5" />
                    {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ''}
                  </span>

                  {existingResponse ? (
                    existingResponse.status === 'accepted' || existingResponse.status === 'approved' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs">
                        <FiCheckCircle /> Response Approved
                      </span>
                    ) : existingResponse.status === 'rejected' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-800 rounded-xl font-bold text-xs">
                        <FiXCircle /> Response Rejected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-xl font-bold text-[11px]">
                        Waiting for Admin Approval
                      </span>
                    )
                  ) : (
                    <Button size="sm" onClick={() => handleOpenRespondModal(req)}>
                      RESPOND
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Donor Response & Eligibility Form Modal */}
      {respondModal.open && respondModal.request && (
        <Modal
          isOpen={respondModal.open}
          onClose={() => setRespondModal({ open: false, request: null })}
          title="Donor Response & Eligibility Form"
        >
          <form onSubmit={handleSubmitResponse} className="space-y-4 text-xs">
            <div className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-red-500 uppercase font-bold block">Hospital Requirement</span>
                <p className="font-bold text-slate-900">{respondModal.request.hospitalName} ({respondModal.request.city})</p>
              </div>
              <BloodGroupBadge bloodGroup={respondModal.request.bloodGroup} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Age (Years) *</label>
                <input
                  type="number"
                  min="18"
                  max="65"
                  required
                  placeholder="e.g. 25"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Weight (kg) *</label>
                <input
                  type="number"
                  min="45"
                  max="200"
                  required
                  placeholder="e.g. 65"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Last Blood Donation Date</label>
                <input
                  type="date"
                  value={form.lastDonationDate}
                  onChange={(e) => setForm({ ...form, lastDonationDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
                <span className="text-[10px] text-slate-400">Leave blank if first-time donor</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Months Since Last Donation</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 6"
                  value={form.monthsSinceLastDonation}
                  onChange={(e) => setForm({ ...form, monthsSinceLastDonation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Blood Group *</label>
                <select
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-bold"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Availability *</label>
                <select
                  value={form.availability ? 'true' : 'false'}
                  onChange={(e) => setForm({ ...form, availability: e.target.value === 'true' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                >
                  <option value="true">Available for Immediate Donation</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={form.healthDeclaration}
                  onChange={(e) => setForm({ ...form, healthDeclaration: e.target.checked })}
                  className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                  Health & Eligibility Declaration: I confirm that I am in good health, feel well today, meet donor age/weight guidelines, and agree to admin verification.
                </span>
              </label>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Additional Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="Specify preferred donation time or special notes..."
                value={form.additionalNotes}
                onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setRespondModal({ open: false, request: null })}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
              >
                {submitting ? 'Submitting...' : 'Submit Response for Admin Review'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default DonorRequests;
