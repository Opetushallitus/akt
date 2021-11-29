import axios from 'axios';

import { AppConstants } from 'enums/app';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    'Caller-Id': AppConstants.CalledID,
  };
  return config;
});

export default axiosInstance;
