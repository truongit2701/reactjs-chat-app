import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://103.75.183.248:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("authState");
      console.log("Unauthorized");
      window.location.href = "/auth/login";
    } else if (error.response && error.response.status === 500) {
      return Promise.reject(error.response);
    } else return Promise.reject(error);
  }
);

export default axiosInstance;
