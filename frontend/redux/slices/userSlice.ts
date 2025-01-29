import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { authService } from "@/services/authService";
import { authRegisterUserType, userType } from "@/types";

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
			console.log(data);
			return data;
		} catch (err) {
			const typedError = err as AxiosError;
			return rejectWithValue(typedError.response?.data);
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
			.addCase(registerUser.rejected, state => {
				state.loading = false;
				state.errors = null;
			}),
});

const {
	reducer: userReducer,
	actions: {},
} = userSlice;

const userActions = { registerUser };

export { userActions, userReducer };
