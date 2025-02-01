import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { projectService } from "@/services/projectService";
import { ApiResponseError, projectType } from "@/types";

interface IInitialState {
	my_projects: projectType[];
	projects: projectType[];
	loading: boolean;
	errors: string | null;
	extra: string | null;
}

const initialState: IInitialState = {
	my_projects: [],
	projects: [],
	loading: false,
	errors: null,
	extra: null,
};

const getUserProjects = createAsyncThunk<projectType[], void>(
	"projectSlice/getUserProjects",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await projectService.getUserProjects();
			return data;
		} catch (err) {
			const typedError = err as AxiosError<ApiResponseError>;
			return rejectWithValue(typedError.response?.data?.detail);
		}
	}
);

const projectSlice = createSlice({
	name: "projectSlice",
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
			.addCase(getUserProjects.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(getUserProjects.fulfilled, (state, action) => {
				state.loading = false;
				state.my_projects = action.payload;
			})
			.addCase(getUserProjects.rejected, (state, action) => {
				state.loading = false;
				state.errors = action.payload as string;
			}),
});

const {
	reducer: projectReducer,
	actions: { setError, setLoading },
} = projectSlice;

const projectActions = {
	getUserProjects,
};

export { projectActions, projectReducer };
