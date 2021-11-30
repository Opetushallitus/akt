import axios from 'axios';

export const fetch = (endpoint: string) => {
  return axios.get(`/api/v1/${endpoint}`);
};
