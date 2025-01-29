import { userUrls } from "@/config";
import { userType, userUpdateBodyType } from "@/types";
import { AxiosRes, axiosService } from "./axiosService";

const userService = {
	getUserBy: (
		id?: number,
		email?: string,
		username?: string
	): AxiosRes<userType> =>
		axiosService.get(userUrls.getUserBy(id, email, username)),

	updateUser: (body: userUpdateBodyType): AxiosRes<userType> =>
		axiosService.patch(userUrls.updateUser(), body),
};

export { userService };
