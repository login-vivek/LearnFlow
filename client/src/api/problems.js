import api from './axios';

export const getProblems  = (params) => api.get('/problems', { params });
export const getPOTD      = ()       => api.get('/problems/potd');
export const getSheet     = (name)   => api.get(`/problems/sheet/${name}`);
export const markSolved   = (id)     => api.post(`/problems/${id}/solve`);
