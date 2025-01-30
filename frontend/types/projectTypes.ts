type projectType = {
	id: number;
	name: string;
	founder_id: number;
	created_at: string;
	updated_at: string | null;
}

type createProjectType = {
	name: string;
}