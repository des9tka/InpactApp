import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { impactService } from "@/services/impactService";
import { ApiResponseError, impactType } from "@/types";

interface IInitialState {
	impacts: impactType[];
	loading: boolean;
	isLoaded: boolean;
	errors: string | null;
	extra: string | null;
}

const initialState: IInitialState = {
	impacts: [],
	loading: false,
	isLoaded: false,
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

const updateImpact = createAsyncThunk<impactType, impactType>(
	"projectSlice/updateImpact",
	async (body, { rejectWithValue }) => {
		try {
			const { data } = await impactService.updateImpact(body.id, body);
			return data;
		} catch (err) {
			const typedError = err as AxiosError<ApiResponseError>;
			return rejectWithValue(typedError.response?.data?.detail);
		}
	}
);

const createImpact = createAsyncThunk<impactType, Partial<impactType>>(
	"projectSlice/createImpact",
	async (body, { rejectWithValue }) => {
		try {
			const { data } = await impactService.createImpact(body);
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
				state.isLoaded = false;
			})
			.addCase(getUserProjectImpacts.fulfilled, (state, action) => {
				state.loading = false;
				const newImpacts = action.payload;
				state.isLoaded = true;

				const uniqueImpacts = [
					...new Map(
						[...state.impacts, ...newImpacts].map(i => [i.id, i])
					).values(),
				];
				state.impacts = uniqueImpacts;
			})

			.addCase(getUserProjectImpacts.rejected, (state, action) => {
				state.loading = false;
				state.errors = action.payload as string;
				state.isLoaded = true;
			})

			// Update Impact;
			.addCase(updateImpact.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(updateImpact.fulfilled, (state, action) => {
				state.loading = false;
				state.impacts = state.impacts.map(i =>
					i.id === action.payload.id ? action.payload : i
				);
			})
			.addCase(updateImpact.rejected, (state, action) => {
				state.loading = false;
				state.errors = action.payload as string;
			})

			// Create Impact;
			.addCase(createImpact.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(createImpact.fulfilled, (state, action) => {
				state.loading = false;
				state.impacts = [...state.impacts, action.payload];
			})
			.addCase(createImpact.rejected, (state, action) => {
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
	updateImpact,
	createImpact,
};

export { impactActions, impactReducer };
