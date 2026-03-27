import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('fz-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
API.interceptors.response.use(res => res, err => {
  if (err.response?.status === 401) { localStorage.removeItem('fz-token'); localStorage.removeItem('fz-user'); window.location.href = '/login'; }
  return Promise.reject(err);
});

export const register = d => API.post('/auth/register', d);
export const login = d => API.post('/auth/login', d);
export const getProfile = () => API.get('/auth/profile');
export const getEvents = () => API.get('/events');
export const getEventById = id => API.get(`/events/${id}`);
export const createEvent = d => API.post('/events', d);
export const updateEvent = (id, d) => API.put(`/events/${id}`, d);
export const deleteEvent = id => API.delete(`/events/${id}`);
export const getEventReport = () => API.get('/events/report');
export const registerForEvent = event_id => API.post('/registrations', { event_id });
export const getMyRegistrations = () => API.get('/registrations/my');
export const cancelRegistration = id => API.put(`/registrations/${id}/cancel`);
export const deleteRegistration = id => API.delete(`/registrations/${id}`);
export const adminDeleteRegistration = id => API.delete(`/registrations/admin/${id}`);
export const adminUpdateRegistrationStatus = (id, status) => API.put(`/registrations/admin/${id}/status`, { status });
export const getAllRegistrations = () => API.get('/registrations/all');
export const applyVolunteer = d => API.post('/volunteers/apply-event', d);
export const getMyAssignments = () => API.get('/volunteers/my-assignments');
export const deleteMyAssignment = id => API.delete(`/volunteers/my-assignments/${id}`);
export const adminDeleteAssignment = id => API.delete(`/volunteers/assignments/${id}`);
export const adminUpdateAssignmentStatus = (id, status) => API.put(`/volunteers/assignments/${id}/status`, { status });
export const getAllVolunteers = () => API.get('/volunteers');
export const getAllAssignments = () => API.get('/volunteers/assignments/all');
export const getSponsors = () => API.get('/sponsors');
export const addSponsor = d => API.post('/sponsors', d);
export const linkSponsorToEvent = d => API.post('/sponsors/link', d);
export const addSponsorContribution = d => API.post('/sponsors/contribution/add', d);
export const deleteSponsor = (id, force = false) =>
  API.delete(`/sponsors/${id}`, { params: force ? { force: 'true' } : {} });
export const getDashboardStats = () => API.get('/analytics/stats');
export const getRegistrationsPerEvent = () => API.get('/analytics/registrations-per-event');
export const getVolunteerDistribution = () => API.get('/analytics/volunteer-distribution');
export const getCategoryBreakdown = () => API.get('/analytics/category-breakdown');

export default API;
