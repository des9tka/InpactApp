import { baseURL } from "@/config";
import axios, { AxiosResponse } from "axios";

import { authService } from "./authService";
import { cookieService } from "./cookieService";

export const axiosService = axios.create({
	baseURL,
});

let isRefreshing = false;
axiosService.interceptors.request.use(config => {
	const access = cookieService.getCookieAccessRefreshTokens()?.access_token;

	if (access) {
		config.headers.Authorization = `Bearer ${access}`;
	}
	return config;
});

axiosService.interceptors.response.use(
	config => config,
	async error => {
		const refresh = cookieService.getCookieAccessRefreshTokens()?.refresh_token;

		if (error.response?.status === 401 && refresh && !isRefreshing) {
			isRefreshing = true;

			try {
				const refresh_token =
					cookieService.getCookieAccessRefreshTokens()?.refresh_token;

				const { data } = await authService.authRefreshTokens(
					refresh_token || ""
				);

				cookieService.deleteCookieAccessRefreshTokens();
				cookieService.setCookieAccessRefreshTokens(data);

				axiosService.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;

				return axiosService(error.config);
			} catch (err) {
				cookieService.deleteCookieAccessRefreshTokens();
				window.location.href = "/login?expired=true";
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

export type AxiosRes<T> = Promise<AxiosResponse<T>>;
