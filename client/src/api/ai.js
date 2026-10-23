import api from './axios';

export const askTUFY        = (question, context = '') => api.post('/ai/ask', { question, context });
export const getHint        = (problem)                => api.post('/ai/hint', { problem });
export const reviewCode     = (code, problem = '')     => api.post('/ai/review', { code, problem });
export const generateNotes  = (topic)                  => api.post('/ai/notes', { topic });
export const getSuggestions = ()                       => api.get('/ai/suggestions');
