const baseUrl = "/auth";

export const authUrls = {
	registerUser: () => baseUrl + "/register",
	loginUser: () => baseUrl + "/login",
	refreshTokens: (refresh_token: string) => baseUrl + "/refresh/" + refresh_token,
	getUserInfo: () => baseUrl + "/get-info",
	activateUser: (token: string) => baseUrl + `/activate/${token}`,
	requestRecoveryPassword: () => baseUrl + "/recovery_request",
	recoveryPassword: () => baseUrl + "/recovery",
};
