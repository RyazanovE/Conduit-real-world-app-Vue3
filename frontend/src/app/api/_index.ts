import axios from 'axios';
import { backendBaseUrl } from '@/shared/config';
import { useCookies } from 'vue3-cookies';
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
    const { cookies } = useCookies();
    const token = cookies.get('token');

    const isAuthPage = config.url && !['/users', '/users/login'].includes(config.url);  

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else if (isAuthPage) {
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
