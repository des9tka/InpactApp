"use client";
import { UsersIcon } from "lucide-react";
import ProjectChartPage from "./ProjectChartPage/ProjectChartPage";

function InvitedProjects() {
	return (
		<div className="flex flex-col justify-center items-center min-h-screen py-2">
			{/* Header with title and users icon */}
			<h1 className="flex gap-2 justify-center items-center text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 w-[45vw] text-center rounded-xl py-4 mb-4">
				Invited Projects <UsersIcon size={28} />
			</h1>
			{/* ProjectChartPage component for displaying invited projects */}
			<ProjectChartPage owner={false} />
		</div>
	);
}

export { InvitedProjects };
