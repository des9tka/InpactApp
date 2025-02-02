"use client";
import {
	ChevronRightIcon,
	LoaderIcon,
	MenuSquareIcon,
	PencilIcon,
	PlusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ChartBar, ChartLinear, ProjectCreateUpdateForm } from "@/components";
import { InviteUserModal } from "@/components/Forms/InviteUserForm/InviteUserForm";
import { impactActions, useAppDispatch, useAppSelector } from "@/redux";
import { impactType } from "@/types";
import { RadioChartNav } from "../RadioChartNav/RadioChartNav";

function ProjectChartPage({ owner }: { owner: boolean }) {
	const [chart, setChart] = useState<"linear" | "bar">("linear");
	const [pNumber, setPNumber] = useState<number>(0);
	const [isPOpen, setIsPOpen] = useState<boolean>(false);
	const [isCreate, setCreate] = useState<boolean>(true);
	const [createUpdateProject, setOpenCreateUpdateProject] =
		useState<boolean>(false);
	const [invite, setInvite] = useState<boolean>(false);
	const [currentImpacts, setCurrentImpacts] = useState<impactType[]>([]);
	const mounted = useRef(false);

	const router = useRouter();
	const dispatch = useAppDispatch();
	const [fetchedProjects, setFetchedProjects] = useState<Set<number>>(
		new Set()
	);

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
			projects.length > 0 &&
			currentProjectId &&
			!fetchedProjects.has(currentProjectId) && // Если проект ещё не был загружен
			impacts.every(impact => impact.project_id !== currentProjectId) // Нет данных для текущего проекта
		) {
			dispatch(impactActions.getUserProjectImpacts(currentProjectId));
			setFetchedProjects(prev => new Set(prev.add(currentProjectId)));
		}

		setCurrentImpacts(
			impacts.filter(i => i.project_id === projects[pNumber]?.id)
		);
	}, [pNumber, projects, impacts, fetchedProjects, dispatch]);

	if (loading)
		return (
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<LoaderIcon className="animate-spin" color="#00FFFF" size={32} />
			</div>
		);

	return (
		<div className="flex flex-col justify-center items-center">
			{createUpdateProject && (
				<ProjectCreateUpdateForm
					create={isCreate}
					setOpenCreateUpdateProject={setOpenCreateUpdateProject}
					project={projects[pNumber]}
					setPNumber={setPNumber}
				/>
			)}

			{invite && (
				<InviteUserModal
					setInvite={setInvite}
					projectId={projects[pNumber]?.id}
				/>
			)}

			{projects.length === 0 ? (
				<>
					{owner ? (
						<h2
							className="flex gap-x-2 bg-sky-700 w-[250px] py-2 px-4 text-xl rounded-md text-center items-center justify-center hover:bg-sky-500 cursor-pointer"
							onClick={() => setOpenCreateUpdateProject(true)}
						>
							Create Project <PlusIcon size={28} />
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
						<div className="absolute top-28 right-4 rounded-md gap-y-2 w-[200px] p-2">
							<div className="flex flex-col gap-y-4 text-xl text-center items-center justify-center">
								{projects.map((project, index) => (
									<div className={"z-20 mt-2"} key={project.id}>
										<span
											className="cursor-pointer mt-2 hover:text-sky-500 bg-sky-900 rounded-md py-2 px-4"
											onClick={() => {
												setPNumber(index);
												toggleMenu();
											}}
										>
											{project.name.length > 15
												? project.name.slice(0, 15) + "..."
												: project.name}
										</span>
									</div>
								))}
							</div>

							{projects.length < 3 && (
								<div
									className="flex items-center gap-2 text-xl text-center cursor-pointer hover:text-green-500 bg-green-900 text-white p-2 rounded-md mt-8 z-50 relative"
									onClick={() => {
										setCreate(true);
										setOpenCreateUpdateProject(true);
									}}
								>
									Create Project
									<PlusIcon size={16} />
								</div>
							)}

							<div
								className="z-50 relative mt-2 hover:text-green-500 bg-green-900 text-white p-2 rounded-md cursor-pointer"
								onClick={() => setInvite(true)}
							>
								Invite User
							</div>
						</div>
					)}

					<span
						className="absolute top-16 right-4"
						onClick={() => setIsPOpen(!isPOpen)}
					>
						<MenuSquareIcon size={36} />
					</span>

					<RadioChartNav chart={chart} setChart={setChart} />

					<h2 className="text-5xl font-bold my-2 text-center flex gap-4 items-center">
						{projects[pNumber]?.name}
						<PencilIcon
							className="hover:text-sky-500 mt-1"
							onClick={() => {
								setCreate(false);
								setOpenCreateUpdateProject(!createUpdateProject);
							}}
						/>
					</h2>

					<div className="w-[93vw] md:w-[65] lg:w-[50] flex justify-center mt-2 z-0 relative">
						{chart == "linear" && <ChartLinear impacts={currentImpacts} />}
						{chart == "bar" && <ChartBar impacts={currentImpacts} />}
					</div>

					<button
						type="button"
						className="mt-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex gap-2"
						onClick={() =>
							router.push(`/data?project=${projects[pNumber]?.id}`)
						}
					>
						Edit data <ChevronRightIcon />
					</button>
				</div>
			)}
		</div>
	);
}

export default ProjectChartPage;
