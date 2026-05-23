import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = 'https://api-hackathon.codedematrixtech.com';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second network boundary timeout
});

// Interceptor to handle preemptive offline checking before packet leaves the client
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      // If client state reads offline natively, cancel transaction and route to custom rejection
      const offlineError = new Error('NETWORK_OFFLINE');
      return Promise.reject(offlineError);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle structured hackathon API exception handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // If the error was explicitly thrown by our pre-fetch check or standard network failure
    if (!error.response) {
      if (error.message === 'NETWORK_OFFLINE' || error.code === 'ERR_NETWORK') {
        return Promise.reject({
          error: 'fetch_failed',
          message: 'Local browser state indicates network is entirely unreachable.'
        });
      }
      return Promise.reject({
        error: 'unknown_transport_error',
        message: error.message
      });
    }

    // Extract exact structured fields defined inside hackathon api.md specification
    const errorData = error.response.data as { error?: string; message?: string };
    
    return Promise.reject({
      status: error.response.status,
      error: errorData.error || 'server_error',
      message: errorData.message || 'An unhandled server-side exception occurred.'
    });
  }
);
