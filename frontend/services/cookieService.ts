import { TokensType } from "@/types";
import Cookies from "js-cookie";

const cookieService = {
	setCookieAccessRefreshTokens: (tokens: TokensType) => {
		const { access_token, refresh_token } = tokens;
		Cookies.set("access_token", access_token, { path: "/" });
		Cookies.set("refresh_token", refresh_token, { path: "/" });
	},

	getCookieAccessRefreshTokens: (): TokensType | null => {
		const access_token = Cookies.get("access_token");
		const refresh_token = Cookies.get("refresh_token");

		if (access_token && refresh_token) {
			return { access_token, refresh_token };
		}

		return null;
	},

	deleteCookieAccessRefreshTokens: () => {
		Cookies.remove("access_token", { path: "/" });
		Cookies.remove("refresh_token", { path: "/" });
	},
};

export { cookieService };
