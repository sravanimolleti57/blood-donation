import API from './api';

const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await API.get('/admin/dashboard/stats');
    return response.data;
  },

  // Donors
  getDonors: async (params = {}) => {
    const response = await API.get('/admin/donors', { params });
    return response.data;
  },

  getDonorById: async (id) => {
    const response = await API.get(`/admin/donors/${id}`);
    return response.data;
  },

  updateDonor: async (id, donorData) => {
    const response = await API.put(`/admin/donors/${id}`, donorData);
    return response.data;
  },

  updateDonorStatus: async (id, isActive) => {
    const response = await API.patch(`/admin/donors/${id}/status`, { isActive });
    return response.data;
  },

  deleteDonor: async (id) => {
    const response = await API.delete(`/admin/donors/${id}`);
    return response.data;
  },

  // Hospitals
  getHospitals: async (params = {}) => {
    const response = await API.get('/admin/hospitals', { params });
    return response.data;
  },

  getHospitalById: async (id) => {
    const response = await API.get(`/admin/hospitals/${id}`);
    return response.data;
  },

  updateHospital: async (id, hospitalData) => {
    const response = await API.put(`/admin/hospitals/${id}`, hospitalData);
    return response.data;
  },

  updateHospitalStatus: async (id, isActive) => {
    const response = await API.patch(`/admin/hospitals/${id}/status`, { isActive });
    return response.data;
  },

  deleteHospital: async (id) => {
    const response = await API.delete(`/admin/hospitals/${id}`);
    return response.data;
  },

  // Donations
  getAllDonations: async () => {
    const response = await API.get('/admin/donations');
    return response.data;
  },
};

export default adminService;
