// api.ts
// import axios from 'axios';

// const baseURL = process.env.NODE_ENV === 'production'
//   ? 'https://api.productionurl.com'
//   : 'http://127.0.0.1:8000/api/v1';

// const api = axios.create({
//   baseURL,
// });

// export default api;


export const url = process.env.NODE_ENV === 'production'
  ? 'https://api.productionurl.com'
  : 'http://82.29.173.87:8000/api/';
