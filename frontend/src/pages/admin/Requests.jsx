import React from 'react';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import { FiDroplet } from 'react-icons/fi';

const AdminRequests = () => {
  const allRequests = [
    { id: 'REQ-101', hospital: 'City Emergency Hospital', city: 'Mumbai', bloodGroup: 'O-', units: 3, urgency: 'URGENT', status: 'Active' },
    { id: 'REQ-102', hospital: 'St. Jude Blood Center', city: 'Mumbai', bloodGroup: 'A+', units: 2, urgency: 'HIGH', status: 'Active' },
    { id: 'REQ-098', hospital: 'Apollo Trauma Care', city: 'Mumbai', bloodGroup: 'B+', units: 4, urgency: 'NORMAL', status: 'Completed' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Platform Blood Requests</h1>
          <p className="text-xs text-slate-500">Monitor all emergency blood requests submitted by hospitals</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <FiDroplet className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
              <tr>
                <th className="p-4">Request ID</th>
                <th className="p-4">Hospital Facility</th>
                <th className="p-4">City</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Units</th>
                <th className="p-4">Urgency</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {allRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{req.id}</td>
                  <td className="p-4 font-semibold text-slate-900">{req.hospital}</td>
                  <td className="p-4 text-slate-500">{req.city}</td>
                  <td className="p-4">
                    <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                  </td>
                  <td className="p-4 font-bold text-slate-900">{req.units} Units</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${req.urgency === 'URGENT' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-700'}`}>
                      {req.urgency}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRequests;
