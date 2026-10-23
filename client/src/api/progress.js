import api from './axios';

export const logProgress = (data) => api.post('/progress', data);
export const getProgress = (days) => api.get('/progress', { params: { days } });
export const getStreak   = ()     => api.get('/progress/streak');
