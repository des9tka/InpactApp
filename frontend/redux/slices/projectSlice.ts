import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { cookieService } from "@/services/cookieService";
import {
	ApiResponse,
	ApiResponseError,
	projectType,
	RecoveryType,
} from "@/types";

interface IInitialState {
	my_project: projectType | null;
	projects: number[] | null;
	loading: boolean;
	errors: string | null;
	extra: string | null;
}

const initialState: IInitialState = {
	my_project: null,
	projects: null,
	loading: false,
	errors: null,
	extra: null,
};

const getUserProject = createAsyncThunk<ApiResponse, RecoveryType>(
	"userSlice/recoveryPassword",
	async (recoveryBody, { rejectWithValue }) => {
		try {
			const { data } = await authService.authRecoveryPassword(recoveryBody);
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
			})

			// Activate User;
			.addCase(activateUser.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(activateUser.fulfilled, (state, action) => {
				state.loading = false;
				state.extra = action.payload.detail;
			})
			.addCase(activateUser.rejected, (state, action) => {
				state.loading = false;
				state.errors = action.payload as string;
			})

			// Request for Recovery Password;
			.addCase(requestRecoveryPassword.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(requestRecoveryPassword.fulfilled, (state, action) => {
				state.loading = false;
				state.extra = action.payload.detail;
			})
			.addCase(requestRecoveryPassword.rejected, (state, action) => {
				state.loading = false;
				state.errors = action.payload as string;
			})

			// Recovery Password;
			.addCase(recoveryPassword.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(recoveryPassword.fulfilled, (state, action) => {
				state.loading = false;
				state.extra = action.payload.detail;
			})
			.addCase(recoveryPassword.rejected, (state, action) => {
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
	activateUser,
	requestRecoveryPassword,
	recoveryPassword,
};

export { userActions, userReducer };
