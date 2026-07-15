import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

let store: any;

export const injectStore = (_store: any) => {
    store = _store;
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (originalRequest.url?.includes("/api/auth/refresh")) {
                if (store) {
                    store.dispatch({ type: "auth/clearAuth" });
                }
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            if (!accessToken || !refreshToken) {
                isRefreshing = false;
                if (store) {
                    store.dispatch({ type: "auth/clearAuth" });
                }
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL || ""}/api/auth/refresh`,
                    {
                        accessToken,
                        refreshToken,
                    }
                );

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

                localStorage.setItem("accessToken", newAccessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                if (store) {
                    store.dispatch({
                        type: "auth/setTokens",
                        payload: { accessToken: newAccessToken, refreshToken: newRefreshToken }
                    });
                }

                processQueue(null, newAccessToken);
                isRefreshing = false;

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;
                if (store) {
                    store.dispatch({ type: "auth/clearAuth" });
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);