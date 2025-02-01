import { AxiosRes, axiosService } from "./axiosService";

import { projectUrls } from "@/config";
import { createProjectType, projectType } from "@/types";
import { get } from "http"

const projectService = {
	creteProject: (body: createProjectType): AxiosRes<projectType> =>
		axiosService.post(projectUrls.createProject(), body),

	getUserProjects: (): AxiosRes<projectType[]> =>
		axiosService.get(projectUrls.getUserProjects()),

	getProjectById: (id: number): AxiosRes<projectType> =>
		axiosService.get(projectUrls.getProjectById(id)),

	addUserToProject: (project_id: number, user_id: number) =>
		axiosService.post(projectUrls.addUserToProject(project_id, user_id)),

	deleteUserFromProject: (project_id: number, user_id: number) =>
		axiosService.delete(projectUrls.deleteUserFromProject(project_id, user_id)),

	deleteProject: (project_id: number) =>
		axiosService.delete(projectUrls.deleteProject(project_id)),

	updateProject: (project_id: number) =>
		axiosService.patch(projectUrls.updateProject(project_id)),
};

export { projectService };
