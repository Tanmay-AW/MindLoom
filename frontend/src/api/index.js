import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// This is an interceptor. It's a function that runs BEFORE every single request.
API.interceptors.request.use((req) => {
  // Check if user info (with the token) exists in localStorage
  const userInfo = localStorage.getItem('userInfo');

  if (userInfo) {
    // If it exists, add the 'Authorization' header to the request
    const token = JSON.parse(userInfo).token;
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req; // Send the request on its way
});

export default API;
