import { baseURL } from "@/config";
import axios, {
	AxiosError,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

import { TokensType } from "@/types";
import { cookieService } from "./cookieService";


export const axiosService = axios.create({
	baseURL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
	failedQueue.forEach(prom => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve();
		}
	});

	failedQueue = [];
};

axiosService.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const accessToken =
			cookieService.getCookieAccessRefreshTokens()?.access_token;

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

axiosService.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	async (error: AxiosError) => {
		const originalRequest = error.config;

		if (
			error.response?.status === 401 &&
			originalRequest &&
			originalRequest.url !== "/auth/refresh"
		) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => {
						return axiosService(originalRequest);
					})
					.catch(err => {
						return Promise.reject(err);
					});
			}

			isRefreshing = true;

			try {
				const refreshToken =
					cookieService.getCookieAccessRefreshTokens()?.refresh_token;

				if (!refreshToken) {
					throw new Error("No refresh token");
				}

				const response = await axiosService.post<TokensType>("/auth/refresh", {
					refresh_token: refreshToken,
				});

				const { access_token, refresh_token } = response.data;
				Cookies.set("access_token", access_token);
				Cookies.set("refresh_token", refresh_token);

				originalRequest.headers.Authorization = `Bearer ${access_token}`;

				processQueue();

				return axiosService(originalRequest);
			} catch (err) {
				processQueue(err);
				Cookies.remove("access_token");
				Cookies.remove("refresh_token");
				window.location.href = "/login";
				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

export type AxiosRes<T> = Promise<AxiosResponse<T>>;
