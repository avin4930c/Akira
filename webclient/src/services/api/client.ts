import axios, { AxiosError, AxiosResponse } from 'axios';

export const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setupInterceptors = (getToken: () => Promise<string | null>) => {
  apiClient.interceptors.request.use(
    async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      //handle token refresh logic
      if (error.response?.status === 401 && error.config) {
        try {
          const refreshedToken = await getToken();
          console.log("refreshedToken: %o", refreshedToken);

          if (refreshedToken) {
            error.config.headers['Authorization'] = `Bearer ${refreshedToken}`;
            return apiClient(error.config); // Retry the original request
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);

          // If refreshing the token fails, log the user out
          // signOut();
        }
      }
      if (error.message === 'Network Error') {
        console.error('Network error occurred');
      }
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout');
      }
      return Promise.reject(error);
    }
  );
};

export const api = {
  get: <T>(url: string, config = {}) =>
    apiClient.get<T>(url, config).then((response) => response.data),
  post: <T, U>(url: string, data: U, config = {}) =>
    apiClient.post<T>(url, data, config).then((response) => response.data),
  put: <T, U>(url: string, data: U, config = {}) =>
    apiClient.put<T>(url, data, config).then((response) => response.data),
  delete: <T>(url: string, config = {}) =>
    apiClient.delete<T>(url, config).then((response) => response.data),
  patch: <T, U>(url: string, data: U, config = {}) =>
    apiClient.patch<T>(url, data, config).then((response) => response.data),
};
