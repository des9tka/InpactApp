"use client";
import { UserIcon } from "lucide-react";

import { projectType } from "@/types";
import ProjectChartPage from "./ProjectChartPage/ProjectChartPage";

function UserProjects() {
	return (
		<div className="flex flex-col justify-center items-center">
			<h1 className="flex gap-2 justify-center items-center text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 w-[45vw] text-center rounded-xl py-4 mb-4">
				My Projects <UserIcon size={28} />
			</h1>
			<ProjectChartPage owner={true} />
		</div>
	);
}

export { UserProjects };
