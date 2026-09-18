import React from 'react';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import Button from '../../components/Button';
import { FiDroplet, FiMapPin, FiClock, FiActivity } from 'react-icons/fi';

const DonorRequests = () => {
  const requests = [
    {
      id: 'REQ-101',
      hospital: 'City Emergency Hospital',
      city: 'Mumbai',
      bloodGroup: 'O-',
      units: 3,
      urgency: 'URGENT',
      postedDate: '2 hours ago',
      address: 'Central Hospital Zone, Sector 4',
    },
    {
      id: 'REQ-102',
      hospital: 'St. Jude Blood Center',
      city: 'Mumbai',
      bloodGroup: 'A+',
      units: 2,
      urgency: 'HIGH',
      postedDate: '5 hours ago',
      address: 'Medical Enclave, Road 12',
    },
    {
      id: 'REQ-103',
      hospital: 'Apollo Trauma Care',
      city: 'Mumbai',
      bloodGroup: 'B+',
      units: 4,
      urgency: 'NORMAL',
      postedDate: '1 day ago',
      address: 'Grand Avenue, North Campus',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Active Blood Requests</h1>
          <p className="text-xs text-slate-500">Urgent blood requirements requested by verified hospitals</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <FiDroplet className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {requests.map((req) => (
          <div key={req.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">{req.id}</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${req.urgency === 'URGENT' ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                  {req.urgency}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{req.hospital}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <FiMapPin className="w-3.5 h-3.5 text-brand-600" />
                    {req.address}, {req.city}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Required</span>
                  <BloodGroupBadge bloodGroup={req.bloodGroup} size="md" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Units</span>
                  <span className="text-sm font-bold text-slate-900">{req.units} Units</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <FiClock className="w-3.5 h-3.5" />
                {req.postedDate}
              </span>
              <Button size="sm">Respond to Request</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonorRequests;
