import api from './axios';

export const getExperiences  = (params) => api.get('/experiences', { params });
export const getExperience   = (id)     => api.get(`/experiences/${id}`);
export const createExperience = (data)  => api.post('/experiences', data);
export const likeExperience  = (id)     => api.post(`/experiences/${id}/like`);
