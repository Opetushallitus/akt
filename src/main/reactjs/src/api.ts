import axios from 'axios';

export const fetch = (endpoint: string) => {
  return axios.get(`/akt/api/v1/${endpoint}`);
};
