import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import Toast from '../../components/Toast';
import {
  FiDroplet,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUserCheck,
  FiUserX,
  FiChevronDown,
  FiChevronUp,
  FiAlertCircle,
  FiCalendar,
  FiRefreshCw,
  FiShield,
} from 'react-icons/fi';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/blood-requests');
      if (data.success) {
        setRequests(data.bloodRequests || data.data || []);
      }
    } catch (error) {
      console.error('Error fetching admin blood requests:', error);
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load blood requests.',
      });
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const { data } = await API.patch(`/blood-requests/${id}/status`, { status: newStatus });
      if (data.success) {
        setToast({
          type: 'success',
          message: `Request status updated to ${newStatus.toUpperCase()}`,
        });
        fetchRequests();
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update request status',
      });
    }
  };

  // Admin verifies donor response: ACCEPT or REJECT
  const handleVerifyResponse = async (requestId, responseId, action) => {
    setVerifyingId(responseId);
    try {
      const { data } = await API.patch(
        `/blood-requests/${requestId}/responses/${responseId}/verify`,
        { action }
      );
      if (data.success) {
        setToast({
          type: 'success',
          message: data.message || `Donor response ${action.toUpperCase()}ED successfully.`,
        });
        fetchRequests();
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || `Failed to ${action} donor response.`,
      });
    } finally {
      setVerifyingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FiDroplet className="text-red-600" />
            Emergency Blood Request & Verification Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review hospital blood requests and verify donor eligibility criteria (6-month rule, history, blood group, availability).
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold transition-colors shrink-0"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Requests
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-medium">Loading emergency blood requests from MongoDB...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm space-y-2">
            <div className="text-3xl">🩸</div>
            <p className="font-bold text-slate-800">No blood requests found in system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-4">Hospital / Facility</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Blood Group</th>
                  <th className="p-4">Units Needed</th>
                  <th className="p-4">Fulfilled</th>
                  <th className="p-4">Urgency</th>
                  <th className="p-4">Responses</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {requests.map((req) => {
                  const responses = req.responses || [];
                  const pendingResponses = responses.filter((r) => r.status === 'pending');
                  const isExpanded = expandedId === req._id;

                  return (
                    <React.Fragment key={req._id}>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-bold text-slate-900">
                          {req.hospitalName}
                          {req.contactPhone && (
                            <span className="block text-[11px] text-slate-400 font-normal">
                              Tel: {req.contactPhone}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-slate-600 font-semibold">{req.city}</td>
                        <td className="p-4">
                          <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                        </td>
                        <td className="p-4 font-bold text-slate-900">{req.unitsRequired} Units</td>
                        <td className="p-4">
                          <span className="font-extrabold text-slate-800">
                            {req.fulfilledUnits || 0} / {req.unitsRequired}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              req.urgency === 'critical'
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : req.urgency === 'urgent'
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {req.urgency}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleExpand(req._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors"
                          >
                            <span>{responses.length} Donor(s)</span>
                            {pendingResponses.length > 0 && (
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                            )}
                            {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                          </button>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              req.status === 'fulfilled'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : req.status === 'approved'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : req.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {req.status === 'fulfilled' ? 'CLOSED / FULFILLED' : req.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {req.status === 'pending' && (
                              <button
                                onClick={() => handleStatusUpdate(req._id, 'approved')}
                                className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                              >
                                Approve
                              </button>
                            )}
                            {req.status !== 'fulfilled' && req.status !== 'cancelled' && (
                              <button
                                onClick={() => handleStatusUpdate(req._id, 'fulfilled')}
                                className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
                              >
                                Mark Closed
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Donor Response Verification Panel */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-slate-200">
                          <td colSpan="9" className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                <div>
                                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                    <FiShield className="text-red-600" /> Responding Donor Verification Criteria Panel
                                  </h3>
                                  <p className="text-[11px] text-slate-500">
                                    Verify 6-month interval criterion, donation history, blood group match, and availability status before approving.
                                  </p>
                                </div>
                                <span className="text-[11px] font-bold text-slate-600">
                                  Request Target: <span className="text-red-600">{req.bloodGroup}</span> Blood Group
                                </span>
                              </div>

                              {responses.length === 0 ? (
                                <div className="p-6 text-center text-slate-400 text-xs italic">
                                  No donor responses submitted for this request yet.
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {responses.map((resp) => {
                                    const donorObj = resp.donor || {};
                                    const details = resp.verificationDetails || {};

                                    return (
                                      <div
                                        key={resp._id}
                                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                                      >
                                        {/* Donor Basic Info */}
                                        <div className="space-y-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-slate-900">{donorObj.name || 'Donor'}</h4>
                                            <BloodGroupBadge bloodGroup={donorObj.bloodGroup || req.bloodGroup} size="sm" />
                                            <span
                                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                                resp.status === 'accepted'
                                                  ? 'bg-emerald-100 text-emerald-800'
                                                  : resp.status === 'rejected'
                                                  ? 'bg-rose-100 text-rose-800'
                                                  : 'bg-amber-100 text-amber-800'
                                              }`}
                                            >
                                              {resp.status}
                                            </span>
                                          </div>
                                          <p className="text-xs text-slate-500">
                                            {donorObj.email} • {donorObj.phone} • {donorObj.city || req.city}
                                          </p>
                                        </div>

                                        {/* Verification Criteria Checklist Badges */}
                                        <div className="flex flex-wrap items-center gap-3 text-xs">
                                          {/* 1. 6-Month Criterion */}
                                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                                              6-Month Rule
                                            </span>
                                            {details.eligibleSixMonths ? (
                                              <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                                                <FiCheckCircle /> Eligible (&gt; 180 days / First-time)
                                              </span>
                                            ) : (
                                              <span className="inline-flex items-center gap-1 font-bold text-rose-700">
                                                <FiXCircle /> Ineligible ({details.daysSinceLastDonation || 0} days ago)
                                              </span>
                                            )}
                                          </div>

                                          {/* 2. Donation History */}
                                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                                              Past History
                                            </span>
                                            <span className="font-bold text-blue-700">
                                              {details.totalDonations || 0} Past Donation(s)
                                            </span>
                                          </div>

                                          {/* 3. Last Donation Date */}
                                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                                              Last Donation
                                            </span>
                                            <span className="font-bold text-slate-800">
                                              {details.lastDonationDate
                                                ? new Date(details.lastDonationDate).toLocaleDateString()
                                                : 'None (First-time)'}
                                            </span>
                                          </div>

                                          {/* 4. Availability */}
                                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                                              Availability
                                            </span>
                                            {donorObj.available !== false ? (
                                              <span className="font-bold text-emerald-700">Available</span>
                                            ) : (
                                              <span className="font-bold text-rose-700">Unavailable</span>
                                            )}
                                          </div>
                                        </div>

                                        {/* Accept / Reject Verification Action Buttons */}
                                        {resp.status === 'pending' && req.status !== 'fulfilled' && (
                                          <div className="flex items-center gap-2 shrink-0">
                                            <button
                                              onClick={() => handleVerifyResponse(req._id, resp._id, 'accept')}
                                              disabled={verifyingId === resp._id}
                                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
                                            >
                                              {verifyingId === resp._id ? 'Verifying...' : 'ACCEPT'}
                                            </button>

                                            <button
                                              onClick={() => handleVerifyResponse(req._id, resp._id, 'reject')}
                                              disabled={verifyingId === resp._id}
                                              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs transition-colors"
                                            >
                                              REJECT
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRequests;
