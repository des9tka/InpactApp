import { impactUrls } from "@/config";
import { impactType } from "@/types";
import { AxiosRes, axiosService } from "./axiosService";

const impactService = {
	createImpact: (impactData: Partial<impactType>): AxiosRes<impactType> =>
		axiosService.post(impactUrls.createImpact(), impactData),

	updateImpact: (
		impactId: number,
		impactData: impactType
	): AxiosRes<impactType> =>
		axiosService.patch(impactUrls.updateImpact(impactId), impactData),

	getImpactsOfProject: (projectId: number): AxiosRes<impactType[]> =>
		axiosService.get(impactUrls.getImpactsOfProject(projectId)),
};

export { impactService };
