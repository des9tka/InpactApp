const baseUrl = "/impacts";

export const impactUrls = {
	createImpact: () => baseUrl,
	updateImpact: (impactId: number) => baseUrl + `/update/${impactId}`,
	getImpactsOfProject: (project_id: number) =>
		baseUrl + `/for-project/${project_id}`,

	deleteImpact: (impactId: number) => baseUrl + `/delete/${impactId}`,
};
