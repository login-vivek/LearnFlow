import api from './axios';

export const getAptitudeQuestions = (params) => api.get('/aptitude', { params });
export const submitAptitude       = (data)   => api.post('/aptitude/submit', data);
