import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { projectService } from "@/services/projectService";
import { userService } from "@/services/userService";
import {
	addUserToProjectType,
	ApiResponse,
	ApiResponseError,
	createProjectType,
	getInviteUserType,
	projectType,
	updateProjectType,
	userType,
} from "@/types";

interface IInitialState {
	my_projects: projectType[];
	projects: projectType[];
	user: userType | null;
	loading: boolean;
	errors: string | null;
	extra: string | null;
}

const initialState: IInitialState = {
	my_projects: [],
	projects: [],
	user: null,
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

const updateProject = createAsyncThunk<projectType, updateProjectType>(
	"projectSlice/updateProject",
	async (body, { rejectWithValue }) => {
		try {
			const { data } = await projectService.updateProject(body.id, {
				name: body.name,
			});
			return data;
		} catch (err) {
			const typedError = err as AxiosError<ApiResponseError>;
			return rejectWithValue(typedError.response?.data?.detail);
		}
	}
);

const deleteProject = createAsyncThunk<number, number>(
	"projectSlice/deleteProject",
	async (project_id, { rejectWithValue }) => {
		try {
			const { data } = await projectService.deleteProject(project_id);
			return data;
		} catch (err) {
			const typedError = err as AxiosError<ApiResponseError>;
			return rejectWithValue(typedError.response?.data?.detail);
		}
	}
);

const getUserForInvite = createAsyncThunk<userType, getInviteUserType>(
	"projectSlice/getUserForInvite",
	async (body, { rejectWithValue }) => {
		try {
			let data: userType[] = [];
			if (body.email) {
				const response = await userService.getUserBy(
					undefined,
					body.email,
					undefined
				);
				data = response.data;
			} else if (body.username) {
				const response = await userService.getUserBy(
					undefined,
					undefined,
					body.username
				);
				data = response.data;
			} else {
				throw new Error("No valid email or username provided.");
			}

			return data[0];
		} catch (err) {
			const typedError = err as AxiosError<ApiResponseError>;
			return rejectWithValue(typedError.response?.data?.detail);
		}
	}
);

const inviteUser = createAsyncThunk<ApiResponse, addUserToProjectType>(
	"projectSlice/inviteUser",
	async (body, { rejectWithValue }) => {
		try {
			const { data } = await projectService.addUserToProject(
				body.project_id,
				body.user_id
			);
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
				state.my_projects = [...state.my_projects, action.payload];
			})
			.addCase(createProject.rejected, (state, action) => {
				state.loading = false;
				state.errors = action.payload as string;
			})

			// Update Project;
			.addCase(updateProject.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(updateProject.fulfilled, (state, action) => {
				state.loading = false;
				state.my_projects = state.my_projects.map(p =>
					p.id === action.payload.id ? action.payload : p
				);
			})
			.addCase(updateProject.rejected, (state, action) => {
				state.loading = false;
				state.errors = action.payload as string;
			})

			// Delete Project;
			.addCase(deleteProject.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(deleteProject.fulfilled, (state, action) => {
				state.loading = false;
				state.my_projects = state.my_projects.filter(
					p => p.id !== action.payload
				);
			})
			.addCase(deleteProject.rejected, (state, action) => {
				state.loading = false;
				state.errors = action.payload as string;
			})

			// Get User For Project;
			.addCase(getUserForInvite.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(getUserForInvite.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(getUserForInvite.rejected, (state, action) => {
				state.loading = false;
				state.errors = action.payload as string;
			})

			// Add User To Project;
			.addCase(inviteUser.pending, state => {
				state.loading = true;
				state.errors = null;
			})
			.addCase(inviteUser.fulfilled, (state, action) => {
				state.loading = false;
				state.extra = action.payload.detail;
			})
			.addCase(inviteUser.rejected, (state, action) => {
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
	updateProject,
	deleteProject,
	getUserForInvite,
	inviteUser,
};

export { projectActions, projectReducer };
