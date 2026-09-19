import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import BloodGroupBadge from '../../components/BloodGroupBadge';
import { FiClock, FiFileText } from 'react-icons/fi';

const DonationHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/donations/my-history');
      if (data.success) {
        setHistoryData(data.donations || data.data || []);
      }
    } catch (error) {
      console.error('Error fetching donation history:', error);
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Donation History</h1>
          <p className="text-xs text-slate-500">Record of your past blood donations and contributions</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
          <FiClock className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading donation records...</div>
        ) : historyData.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FiFileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No donation records available.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your verified donations will automatically be logged here once completed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
                <tr>
                  <th className="p-4">Donation Date</th>
                  <th className="p-4">Hospital / Blood Bank</th>
                  <th className="p-4">Blood Group</th>
                  <th className="p-4">Units Donated</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {historyData.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      {new Date(item.donationDate || item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">{item.hospitalName || item.hospital?.name || 'General Facility'}</td>
                    <td className="p-4">
                      <BloodGroupBadge bloodGroup={item.bloodGroup} size="sm" />
                    </td>
                    <td className="p-4">{item.units || 1} Unit(s)</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        {item.status || 'completed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationHistory;
