import axios from 'axios';
import { backendBaseUrl } from '@/shared/config';
import router from '../routes/_index';

const api = axios.create({
  baseURL: backendBaseUrl, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  config => {
    let token = ''
    const user = localStorage.getItem('user');

    if (user) {
      token = JSON.parse(user).token
    }

    const notAuthPage = config.url && !['/users', '/users/login'].includes(config.url);  


    if (notAuthPage && !token) {
      sessionStorage.removeItem("user");
      router.push({ name: 'login'})
      return Promise.reject(new Error('No token available'));
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export { api };
