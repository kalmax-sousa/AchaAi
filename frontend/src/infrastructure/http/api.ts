import axios, { AxiosError } from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    console.log(`Intercepted error: ${(error as AxiosError).message}`)
    return Promise.reject(error)
  }
)

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});