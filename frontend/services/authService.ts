import { authUrls } from "@/config";
import {
	authLoginUserType,
	authRegisterUserType,
	TokensType,
	userType,
	ApiResponse
} from "@/types";
import { AxiosRes, axiosService } from "./axiosService";

const authService = {
	authRegisterUser: (body: authRegisterUserType): AxiosRes<userType> =>
		axiosService.post(authUrls.registerUser(), body),

	authLoginUser: (body: authLoginUserType): AxiosRes<TokensType> =>
		axiosService.post(authUrls.loginUser(), body),

	authRefreshTokens: (): AxiosRes<TokensType> =>
		axiosService.post(authUrls.refreshTokens()),

	authGetUserInfo: (): AxiosRes<userType> =>
		axiosService.get(authUrls.getUserInfo()),

	authActivateUser: (token: string): AxiosRes<ApiResponse> =>
		axiosService.get(authUrls.activateUser(token)),
};

export { authService };
