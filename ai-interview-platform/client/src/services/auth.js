import API from './api/apiClient';

export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

export const signupUser = async (userData) => {
  const response = await API.post('/auth/signup', userData);
  return response.data;
};