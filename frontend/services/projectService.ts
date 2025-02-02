import { AxiosRes, axiosService } from "./axiosService";

import { projectUrls } from "@/config";
import { ApiResponse, createProjectType, projectType, userType } from "@/types";

const projectService = {
	creteProject: (body: createProjectType): AxiosRes<projectType> =>
		axiosService.post(projectUrls.createProject(), body),

	getUserProjects: (): AxiosRes<projectType[]> =>
		axiosService.get(projectUrls.getUserProjects()),

	getInvitedProjects: (): AxiosRes<projectType[]> =>
		axiosService.get(projectUrls.getInvitedProjects()),

	getProjectById: (id: number): AxiosRes<projectType> =>
		axiosService.get(projectUrls.getProjectById(id)),

	addUserToProject: (
		project_id: number,
		user_id: number
	): AxiosRes<ApiResponse> =>
		axiosService.get(projectUrls.addUserToProject(project_id, user_id)),

	deleteUserFromProject: (
		project_id: number,
		user_id: number
	): AxiosRes<ApiResponse> =>
		axiosService.delete(projectUrls.deleteUserFromProject(project_id, user_id)),

	deleteProject: (project_id: number): AxiosRes<ApiResponse> =>
		axiosService.delete(projectUrls.deleteProject(project_id)),

	updateProject: (
		project_id: number,
		body: Partial<projectType>
	): AxiosRes<projectType> =>
		axiosService.patch<projectType>(
			projectUrls.updateProject(project_id),
			body
		),

	joinProject: (invite_token: string): AxiosRes<ApiResponse> =>
		axiosService.get(projectUrls.joinTeam(invite_token)),

	getUsersFromProject: (project_id: number): AxiosRes<userType[]> =>
		axiosService.get(projectUrls.getUsersFromProject(project_id)),
};

export { projectService };
