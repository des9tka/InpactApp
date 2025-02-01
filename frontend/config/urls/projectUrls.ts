export const projectUrls = {
	createProject: () => "/projects?",

	getProjectById: (project_id: number) => `/projects/${project_id}`,

	getUserProjects: () => "/projects",

	addUserToProject: (project_id: number, user_id: number) =>
		`projects/${project_id}/add-user/${user_id}`,

	deleteProject: (project_id: number) => `/projects/delete/${project_id}`,

	updateProject: (project_id: number) => `/projects/update/${project_id}`,

	deleteUserFromProject: (project_id: number, user_id: number) =>
		`projects/${project_id}/delete-user/${user_id}`,
};
