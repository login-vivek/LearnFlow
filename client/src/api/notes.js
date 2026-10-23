import api from './axios';

export const getNotes    = ()       => api.get('/notes');
export const createNote  = (data)   => api.post('/notes', data);
export const updateNote  = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote  = (id)     => api.delete(`/notes/${id}`);

export const getSnippets    = ()       => api.get('/notes/snippets');
export const createSnippet  = (data)   => api.post('/notes/snippets', data);
export const updateSnippet  = (id, data) => api.put(`/notes/snippets/${id}`, data);
export const deleteSnippet  = (id)     => api.delete(`/notes/snippets/${id}`);
