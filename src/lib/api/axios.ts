import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import superjson from "superjson";
import { ApiError } from "@/types/api.types";
import { API_ROUTES } from "@/constants/api";
import { STORAGE_KEYS } from "@/lib/constants";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - Add auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const authStorageStr = localStorage.getItem(STORAGE_KEYS.AUTH_STORE);
      if (authStorageStr) {
        try {
          const authStorage = JSON.parse(authStorageStr);
          const token = authStorage?.state?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            delete config.headers.Authorization;
          }
        } catch (e) {
          console.error("Failed to parse auth store token", e);
          delete config.headers.Authorization;
        }
      } else {
        delete config.headers.Authorization;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    // resData is pointer towards response.data
    const resData = response.data as any;

    // Handle SuperJSON deserialization
    if (resData && resData.data && resData.meta) {
      resData.data = superjson.deserialize({
        json: resData.data,
        meta: resData.meta,
      });
    }

    // Globally unwrap the 'data' field if it exists in our standard response wrapper.
    // For list endpoints where we need pagination meta, callers can opt-in by setting
    // `_returnWrapper: true` in the request config.
    if (resData && typeof resData === "object" && "data" in resData) {
      const returnWrapper = (response.config as any)?._returnWrapper === true;
      return returnWrapper ? resData : resData.data;
    }

    return response.data;
  },
  async (error: AxiosError<any>) => {
    const apiError: ApiError = {
      message:
        error.response?.data?.message || error.message || "An error occurred",
      statusCode: error.response?.status || 500,
      details: error.response?.data?.details,
    };

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Token Refresh Flow
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Prevent refresh loops on auth endpoints
      const isAuthEndpoint =
        originalRequest.url?.includes(API_ROUTES.AUTH.LOGIN) ||
        originalRequest.url?.includes(API_ROUTES.AUTH.REFRESH);

      if (isAuthEndpoint) {
        isRefreshing = false;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }
        return Promise.reject(apiError);
      }

      try {
        // Attempt to refresh the token using an isolated axios call (to avoid interceptor loops)
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/${API_ROUTES.AUTH.REFRESH}`,
          {},
          { withCredentials: true },
        );

        let newAccessToken = refreshResponse.data?.data?.accessToken;

        // Extract through superjson if backend happens to serialize it
        if (
          !newAccessToken &&
          refreshResponse.data?.data &&
          refreshResponse.data?.meta
        ) {
          const deserialized = superjson.deserialize<any>({
            json: refreshResponse.data.data,
            meta: refreshResponse.data.meta,
          });
          newAccessToken = deserialized?.accessToken;
        }

        if (newAccessToken) {
          // Notify Zustand store of the new access token securely
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("auth:refresh", {
                detail: { token: newAccessToken },
              }),
            );
          }

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return axiosInstance(originalRequest);
        } else {
          throw new Error("New access token not found in refresh response");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // If refresh fails or is expired, gracefully log everything out
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }
        return Promise.reject(apiError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("forbidden-error"));
      }
    }

    return Promise.reject(apiError);
  },
);

export default axiosInstance;
