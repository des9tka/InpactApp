import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { authService } from "@/services/authService";
import { cookieService } from "@/services/cookieService";
import {
	ApiResponseError,
	authLoginUserType,
	authRegisterUserType,
	TokensType,
	userType,
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

const userSlice = createSlice({
	name: "userSlice",
	initialState,
	reducers: {},
	extraReducers: builder =>
		builder

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
			}),
});

const {
	reducer: userReducer,
	actions: {},
} = userSlice;

const userActions = { registerUser, loginUser };

export { userActions, userReducer };
