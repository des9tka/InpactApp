const baseUrl = "/auth";

export const authUrls = {
	registerUser: () => baseUrl + "/register",
	loginUser: () => baseUrl + "/login",
	refreshTokens: () => baseUrl + "/refresh",
	getUserInfo: () => baseUrl + "/get-info",
};
