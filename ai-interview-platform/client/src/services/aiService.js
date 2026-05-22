import API from './api';

export const startSession = async (params) => {
  const response = await API.post('/interview/session/start', params);
  return response.data;
};

export const submitAnswer = async (answerData) => {
  const response = await API.post('/interview/session/answer', answerData);
  return response.data;
};