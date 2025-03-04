// api.ts
import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://api.productionurl.com'
  : 'http://127.0.0.1:8080/api/v1';

const api = axios.create({
  baseURL,
});

export default api;
