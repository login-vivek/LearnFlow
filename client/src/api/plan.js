import api from './axios';

export const createPlan     = (data)   => api.post('/plan', data);
export const getActivePlan  = ()       => api.get('/plan/active');
export const completeTask   = (taskId) => api.patch(`/plan/task/${taskId}/complete`);
export const reschedulePlan = ()       => api.post('/plan/reschedule');
