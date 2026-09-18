import React from 'react';
import { Link } from 'react-router-dom';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import Button from '../../components/Button';
import { FiList, FiFilePlus } from 'react-icons/fi';

const HospitalRequests = () => {
  const requests = [
    { id: 'REQ-101', bloodGroup: 'O-', units: 3, urgency: 'URGENT', date: '18 Sep 2026', status: 'Active' },
    { id: 'REQ-102', bloodGroup: 'AB+', units: 2, urgency: 'NORMAL', date: '17 Sep 2026', status: 'Active' },
    { id: 'REQ-098', bloodGroup: 'A+', units: 4, urgency: 'HIGH', date: '10 Sep 2026', status: 'Completed' },
    { id: 'REQ-085', bloodGroup: 'B-', units: 1, urgency: 'NORMAL', date: '28 Aug 2026', status: 'Completed' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Hospital Blood Requests</h1>
          <p className="text-xs text-slate-500">History of all blood requests published by your hospital</p>
        </div>
        <Link to="/hospital/create-request">
          <Button icon={FiFilePlus}>New Request</Button>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
              <tr>
                <th className="p-4">Request ID</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Units</th>
                <th className="p-4">Urgency</th>
                <th className="p-4">Posted Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{req.id}</td>
                  <td className="p-4">
                    <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                  </td>
                  <td className="p-4 font-bold text-slate-900">{req.units} Units</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${req.urgency === 'URGENT' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-700'}`}>
                      {req.urgency}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{req.date}</td>
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

export default HospitalRequests;
