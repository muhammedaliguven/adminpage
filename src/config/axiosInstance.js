import axios from 'axios';
import API_URL from './apiConfig';

const axiosInstance = axios.create({
  baseURL: API_URL, // Tüm isteklerde kullanılacak temel URL
});

export default axiosInstance;