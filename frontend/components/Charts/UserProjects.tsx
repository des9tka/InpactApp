"use client";
import { projectType } from "@/types"
import { Plus, User } from "lucide-react";

function UserProjects({my_projects}: {my_projects: projectType[]}) {
	return (
		<div className="flex-col flex justify-center items-center mb-10">
			<h1 className="flex gap-2 justify-center items-center text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 w-[45vw] text-center rounded-xl py-4 mb-4">
				My Projects <User size={28} />
			</h1>
			<h2 className="flex gap-y-2 bg-sky-700 w-[250px] py-2 px-4 text-xl rounded-md text-center items-center justify-center hover:bg-sky-500 cursor-pointer">
				Create Project <Plus size={28} />
			</h2>
		</div>
	);
}

export { UserProjects };
