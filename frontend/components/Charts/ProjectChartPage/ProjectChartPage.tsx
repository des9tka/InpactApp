"use client";
import { ChevronRight, LoaderIcon, MenuSquareIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ChartBar, ChartLinear, ProjectCreateForm } from "@/components";
import { impactActions, useAppDispatch, useAppSelector } from "@/redux";
import { RadioChartNav } from "../RadioChartNav/RadioChartNav";

function ProjectChartPage({ owner }: { owner: boolean }) {
	const [chart, setChart] = useState<"linear" | "bar">("linear");
	const [pNumber, setPNumber] = useState<number>(0);
	const [isPOpen, setIsPOpen] = useState<boolean>(false);
	const [createProject, setCreateProject] = useState<boolean>(false);
	const mounted = useRef(false);

	const router = useRouter();
	const dispatch = useAppDispatch();

	const { impacts, loading } = useAppSelector(state => state.impactReducer);

	const { my_projects, projects: invited_projects } = useAppSelector(
		state => state.projectReducer
	);

	const projects = useMemo(
		() => (owner ? my_projects : invited_projects),
		[owner, my_projects, invited_projects]
	);

	const toggleMenu = useCallback(() => {
		setIsPOpen(prev => !prev);
	}, []);

	useEffect(() => {
		if (!mounted.current) {
			mounted.current = true;
		}

		const currentProjectId = projects[pNumber]?.id;
		if (
			currentProjectId &&
			!impacts.some(impact => impact.project_id === currentProjectId)
		) {
			dispatch(impactActions.getUserProjectImpacts(currentProjectId));
		}
	}, [pNumber]);

	return (
		<div className="flex flex-col justify-center items-center">
			{loading && (
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
					<LoaderIcon className="animate-spin" color="#00FFFF" size={32} />
				</div>
			)}
			{createProject && (
				<ProjectCreateForm setCreateProject={setCreateProject} />
			)}

			{projects.length === 0 ? (
				<>
					{owner ? (
						<h2
							className="flex gap-x-2 bg-sky-700 w-[250px] py-2 px-4 text-xl rounded-md text-center items-center justify-center hover:bg-sky-500 cursor-pointer"
							onClick={() => setCreateProject(true)}
						>
							Create Project <Plus size={28} />
						</h2>
					) : (
						<h2 className="flex gap-x-2 bg-sky-900 py-2 px-4 text-xl rounded-md text-center items-center justify-center hover:bg-sky-500 cursor-pointer">
							You are not Joined in any of projects.
						</h2>
					)}
				</>
			) : (
				<div className="flex flex-col justify-center items-center relative">
					{isPOpen && (
						<div className="absolute top-28 right-24 rounded-md gap-y-2 w-[150px]">
							<div className="flex flex-col gap-2 py-2 px-4 text-xl rounded-md text-center items-center justify-center cursor-pointer">
								{projects.map((project, index) => (
									<span
										key={index}
										className="z-100 cursor-pointer hover:text-sky-500 bg-sky-900 rounded-md py-2 px-4"
										onClick={() => {
											setPNumber(index);
											toggleMenu();
											mounted.current = true;
										}}
									>
										{project && project.name.length > 15
											? project.name.slice(0, 15) + "..."
											: project.name}
									</span>
								))}
							</div>
						</div>
					)}

					<span
						className="absolute top-16 right-24"
						onClick={() => setIsPOpen(!isPOpen)}
					>
						<MenuSquareIcon size={36} />
					</span>

					<RadioChartNav chart={chart} setChart={setChart} />

					<h2 className="text-5xl font-bold my-2">{projects[pNumber]?.name}</h2>

					<div className="w-[95vw] md:w-[65] lg:w-[50] flex justify-center mt-2">
						{chart == "linear" && <ChartLinear impacts={impacts} />}
						{chart == "bar" && <ChartBar impacts={impacts} />}
					</div>

					<button
						type="button"
						className="mt-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex gap-2"
						onClick={() =>
							router.push(`/data?project=${projects[pNumber]?.id}`)
						}
					>
						Edit data <ChevronRight />
					</button>
				</div>
			)}
		</div>
	);
}

export default ProjectChartPage;
