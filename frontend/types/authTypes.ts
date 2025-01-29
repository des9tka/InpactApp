type authRegisterUserType = {
	email: string;
	username: string;
	password: string;
	name?: string;
	surname?: string;
};

type authLoginUserType = {
	email: string;
	password: string;
};

type TokensType = {
	access_token: string;
	refresh_token: string;
};

// type AccessTokenType = {
// 	access_token: string;
// };

// type RefreshTokenType = {
// 	refresh_token: string;
// };

export type {
	// AccessTokenType,
	authLoginUserType,
	authRegisterUserType,
	// RefreshTokenType,
	TokensType,
};
