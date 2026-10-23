import api from './api';

/**
 * User / profile API service.
 * Keeps API calls out of components.
 */
const userService = {
  getProfile: () => api.get('/users/profile'),

  updateProfile: (data) => api.put('/users/profile', data),
};

export default userService;
