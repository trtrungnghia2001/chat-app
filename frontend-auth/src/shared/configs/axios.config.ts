import axios, { AxiosError } from "axios";
import ENV_CONFIG from "./env.config";
import { refreshTokenApi } from "@/features/auth/apis/authApi";
import { useAuthStore } from "@/features/auth/stores/auth.store";

const instance = axios.create({
  baseURL: ENV_CONFIG.URL_SERVER,
  withCredentials: true,
});

instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error: AxiosError) {
    const originalRequest = error.config;
    const customError = error.response?.data;

    // refresh token
    if (error.response?.status === 401 && originalRequest) {
      try {
        const refreshToken = await refreshTokenApi();
        if (refreshToken.status === 401) {
          await useAuthStore.getState().signout();
          return Promise.reject(customError);
        }
        if (refreshToken.status === 200) {
          return instance(originalRequest);
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          await useAuthStore.getState().signout();
          return Promise.reject({
            status: 401,
            message: "Please login again",
          });
        }
      }
    }

    return Promise.reject(customError);
  }
);

export default instance;
