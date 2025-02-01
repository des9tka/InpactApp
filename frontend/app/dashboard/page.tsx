"use client"
import { InvitedProjects, UserProjects } from "@/components";
import { useAppSelector } from "@/redux"

function DashboardPage() {

	const {my_projects, projects} = useAppSelector(state => state.projectReducer);

	return (
		<div className="flex flex-col justify-center items-center min-h-screen py-2">
			<UserProjects my_projects={my_projects}/>

			<InvitedProjects projects={projects}/>
		</div>
	);
}

export default DashboardPage;
