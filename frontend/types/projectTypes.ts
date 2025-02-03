type projectType = {
	id: number;
	name: string;
	founder_id: number;
	created_at: string;
	updated_at: string | null;
};

type createProjectType = {
	name: string;
};

type updateProjectType = {
	name: string;
	id: number;
};

type addUserToProjectType = {
	user_id: number;
	project_id: number;
};

type deleteUserFromProjectType = {
	user_id: number;
	project_id: number;
	self?: boolean;
};

export type {
	addUserToProjectType,
	createProjectType,
	projectType,
	updateProjectType,
	deleteUserFromProjectType
};
