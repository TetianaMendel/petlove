import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://petlove.b.goit.study',
  withCredentials: true,
});