import axios from 'axios';

const API = axios.create({
  baseURL: 'https://college-api-wzcn.onrender.com/api'
});

export default API;