import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { projectService } from "@/services/projectService";
import { ApiResponseError, createProjectType, projectType } from "@/types";

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

const getInvitedProjects = createAsyncThunk<projectType[], void>(
	"projectSlice/getInvitedProjects",
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await projectService.getInvitedProjects();
			return data;
		} catch (err) {
			const typedError = err as AxiosError<ApiResponseError>;
			return rejectWithValue(typedError.response?.data?.detail);
		}
	}
);

const createProject = createAsyncThunk<projectType, createProjectType>(
	"projectSlice/createProject",
	async (body, { rejectWithValue }) => {
		try {
			const { data } = await projectService.creteProject(body);
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
			})

			// Get Invited User Projects;
			.addCase(getInvitedProjects.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(getInvitedProjects.fulfilled, (state, action) => {
				state.loading = false;
				state.projects = action.payload;
			})
			.addCase(getInvitedProjects.rejected, (state, action) => {
				state.loading = false;
				state.errors = action.payload as string;
			})

			// Create Project;
			.addCase(createProject.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(createProject.fulfilled, (state, action) => {
				state.loading = false;
				state.my_projects = [...state.projects, action.payload];
			})
			.addCase(createProject.rejected, (state, action) => {
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
	setError,
	setLoading,
	getInvitedProjects,
	createProject,
};

export { projectActions, projectReducer };
