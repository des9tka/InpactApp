import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { impactService } from "@/services/impactService";
import { ApiResponseError, impactType } from "@/types";

interface IInitialState {
	impacts: impactType[];
	loading: boolean;
	errors: string | null;
	extra: string | null;
}

const initialState: IInitialState = {
	impacts: [],
	loading: false,
	errors: null,
	extra: null,
};

const getUserProjectImpacts = createAsyncThunk<impactType[], number>(
	"projectSlice/getUserProjectImpacts",
	async (projectId, { rejectWithValue }) => {
		try {
			const { data } = await impactService.getImpactsOfProject(projectId);
			return data;
		} catch (err) {
			const typedError = err as AxiosError<ApiResponseError>;
			return rejectWithValue(typedError.response?.data?.detail);
		}
	}
);

const impactSlice = createSlice({
	name: "impactSlice",
	initialState,
	reducers: {
		setError(state, action) {
			state.errors = action.payload;
		},
		setLoading(state, action) {
			state.loading = action.payload;
		},
	},
	extraReducers: builder =>
		builder
			// Get User Projects;
			.addCase(getUserProjectImpacts.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(getUserProjectImpacts.fulfilled, (state, action) => {
				state.loading = false;
				state.impacts = [...action.payload];
			})
			.addCase(getUserProjectImpacts.rejected, (state, action) => {
				state.loading = false;
				state.errors = action.payload as string;
			}),
});

const {
	reducer: impactReducer,
	actions: { setError, setLoading },
} = impactSlice;

const impactActions = {
	getUserProjectImpacts,
	setError,
	setLoading,
};

export { impactActions, impactReducer };
