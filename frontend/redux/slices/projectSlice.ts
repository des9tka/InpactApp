import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { authService } from "@/services/authService";
import { cookieService } from "@/services/cookieService";
import { userService } from "@/services/userService";
import {
	ApiResponseError,
	authLoginUserType,
	authRegisterUserType,
	TokensType,
	userType,
	userUpdateBodyType,
} from "@/types";

interface IInitialState {
	user: userType | null;
	loading: boolean;
	errors: string | null;
}

const initialState: IInitialState = {
	user: null,
	loading: false,
	errors: null,
};

const registerUser = createAsyncThunk<userType, authRegisterUserType>(
	"noteSlice/setUserId",
	async (body, { rejectWithValue }) => {
		try {
			const { data } = await authService.authRegisterUser(body);
			return data;
		} catch (err) {
			const typedError = err as AxiosError<ApiResponseError>;
			return rejectWithValue(typedError.response?.data?.detail);
		}
	}
);

const loginUser = createAsyncThunk<TokensType, authLoginUserType>(
	"noteSlice/loginUser",
	async (body, { rejectWithValue }) => {
		try {
			const { data } = await authService.authLoginUser(body);
			return data;
		} catch (err) {
			const typedError = err as AxiosError<ApiResponseError>;
			return rejectWithValue(typedError.response?.data?.detail);
		}
	}
);

const setUpUserInfo = createAsyncThunk<userType, void>(
	"noteSlice/setUpUserInfo",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await authService.authGetUserInfo();
			await new Promise(resolve => setTimeout(resolve, 1000)); // Artificial delay for Loader Appear;

			return data;
		} catch (err) {
			const typedError = err as AxiosError<ApiResponseError>;
			return rejectWithValue(typedError.response?.data?.detail);
		}
	}
);

const updateUserData = createAsyncThunk<userType, userUpdateBodyType>(
	"noteSlice/updateUserData",
	async (body, { rejectWithValue }) => {
		try {
			const { data } = await userService.updateUser(body);
			return data;
		} catch (err) {
			const typedError = err as AxiosError<ApiResponseError>;
			return rejectWithValue(typedError.response?.data?.detail);
		}
	}
);

const userSlice = createSlice({
	name: "userSlice",
	initialState,
	reducers: {
		setError(state, action) {
			state.errors = action.payload;
		},
	},
	extraReducers: builder =>
		builder
			// Register User;
			.addCase(registerUser.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				state.errors = action.payload as string;
			})

			// Login User;
			.addCase(loginUser.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false;
				cookieService.setCookieAccessRefreshTokens(action.payload);
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.errors = action.payload as string;
			})

			// Get User Info (Pre);
			.addCase(setUpUserInfo.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(setUpUserInfo.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
				console.log(action.payload);
			})
			.addCase(setUpUserInfo.rejected, (state, action) => {
				state.loading = false;
				state.errors = action.payload as string;
			})

			// Update User Info;
			.addCase(updateUserData.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(updateUserData.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(updateUserData.rejected, (state, action) => {
				state.loading = false;
				state.errors = action.payload as string;
			}),
});

const {
	reducer: userReducer,
	actions: { setError },
} = userSlice;

const userActions = {
	registerUser,
	loginUser,
	setUpUserInfo,
	updateUserData,
	setError,
};

export { userActions, userReducer };
