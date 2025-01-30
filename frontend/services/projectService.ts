import { projectUrls } from "@/config";
import {  } from "@/types";
import { AxiosRes, axiosService } from "./axiosService";

const userService = {
	creteProject: (
		id?: number,
		email?: string,
		username?: string
	): AxiosRes<userType> =>
		axiosService.get(userUrls.getUserBy(id, email, username)),

	updateUser: (body: userUpdateBodyType): AxiosRes<userType> =>
		axiosService.patch(userUrls.updateUser(), body),
};

export { userService };

// createProject: () => "/projects?",

// 	addUserToProject: (project_id: number, user_id: number) =>
// 		`projects/${project_id}/add-user/${user_id}`,

// 	deleteProject: (project_id: number) => `/projects/delete/${project_id}`,

// 	updateProject: (project_id: number) => `/projects/update/${project_id}`,

// 	deleteUserFromProject: (project_id: number, user_id: number) =>
// 		`projects/${project_id}/delete-user/${user_id}`,
