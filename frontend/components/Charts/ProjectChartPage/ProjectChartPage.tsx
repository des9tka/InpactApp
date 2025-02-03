"use client";
import {
	ChevronRightIcon,
	LoaderIcon,
	MenuSquareIcon,
	PencilIcon,
	PlusIcon,
	UsersIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ChartBar, ChartLinear, ProjectCreateUpdateForm } from "@/components";
import { InviteUserModal } from "@/components/Forms/InviteUserForm/InviteUserForm";
import { impactActions, useAppDispatch, useAppSelector } from "@/redux";
import { impactType } from "@/types";
import { RadioChartNav } from "../RadioChartNav/RadioChartNav";

function ProjectChartPage({ owner }: { owner: boolean }) {
	// State hooks for various functionalities
	const [chart, setChart] = useState<"linear" | "bar">("linear"); // Chart type (linear or bar)
	const [pNumber, setPNumber] = useState<number>(0); // Current project index
	const [isPOpen, setIsPOpen] = useState<boolean>(false); // Menu visibility for project list
	const [isCreate, setCreate] = useState<boolean>(true); // Determines if creating or updating project
	const [createUpdateProject, setOpenCreateUpdateProject] =
		useState<boolean>(false); // State for project form visibility
	const [invite, setInvite] = useState<boolean>(false); // Invite modal visibility
	const [currentImpacts, setCurrentImpacts] = useState<impactType[]>([]); // Current project's impacts
	const mounted = useRef(false); // Ref to check component mount status

	const router = useRouter();
	const dispatch = useAppDispatch();
	const [fetchedProjects, setFetchedProjects] = useState<Set<number>>(
		new Set()
	); // Tracks fetched projects

	// Get necessary data from redux store
	const { impacts, loading } = useAppSelector(state => state.impactReducer);
	const { my_projects, projects: invited_projects } = useAppSelector(
		state => state.projectReducer
	);

	// Memoize projects to avoid unnecessary re-renders
	const projects = useMemo(
		() => (owner ? my_projects : invited_projects),
		[owner, my_projects, invited_projects]
	);

	// Toggle menu visibility
	const toggleMenu = useCallback(() => {
		setIsPOpen(prev => !prev);
	}, []);

	useEffect(() => {
		if (!mounted.current) {
			mounted.current = true;
		}

		const currentProjectId = projects[pNumber]?.id;

		// Fetch impacts for current project if not already fetched
		if (
			projects.length > 0 &&
			currentProjectId &&
			!fetchedProjects.has(currentProjectId) &&
			impacts.every(impact => impact.project_id !== currentProjectId)
		) {
			dispatch(impactActions.getUserProjectImpacts(currentProjectId));
			setFetchedProjects(prev => new Set(prev.add(currentProjectId)));
		}

		// Filter impacts for the current project
		setCurrentImpacts(
			impacts.filter(i => i.project_id === projects[pNumber]?.id)
		);
	}, [pNumber, projects, impacts, fetchedProjects, dispatch]);

	// Loading spinner if data is being fetched
	if (loading)
		return (
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<LoaderIcon className="animate-spin" color="#00FFFF" size={32} />
			</div>
		);

	return (
		<div className="flex flex-col justify-center items-center">
			{/* Project create/update form */}
			{createUpdateProject && (
				<ProjectCreateUpdateForm
					create={isCreate}
					setOpenCreateUpdateProject={setOpenCreateUpdateProject}
					project={projects[pNumber]}
					setPNumber={setPNumber}
				/>
			)}

			{/* Invite user modal */}
			{invite && (
				<InviteUserModal
					setInvite={setInvite}
					projectId={projects[pNumber]?.id}
				/>
			)}

			{/* If no projects exist, show option to create or join */}
			{projects.length === 0 ? (
				<>
					{/* Owner creating a project */}
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
					{/* Project menu toggle */}
					{isPOpen && (
						<div className="absolute top-28 right-4 rounded-md gap-y-2 w-[200px] p-2">
							{/* List of projects */}
							<div className="flex flex-col gap-y-4 text-xl text-center items-center justify-center">
								{projects.map((project, index) => (
									<div className={"z-20 mt-2"} key={project.id}>
										<span
											className="cursor-pointer mt-2 hover:text-sky-500 bg-sky-900 rounded-md py-2 px-4"
											onClick={() => {
												setPNumber(index); // Set current project
												toggleMenu(); // Close menu
											}}
										>
											{/* Truncate long project names */}
											{project.name.length > 15
												? project.name.slice(0, 15) + "..."
												: project.name}
										</span>
									</div>
								))}
							</div>

							{/* Option to create a project if there are fewer than 3 projects */}
							{projects.length < 3 && owner && (
								<div
									className="flex items-center justify-center gap-2 text-xl text-center cursor-pointer hover:text-green-500 bg-green-900 text-white p-2 rounded-md mt-8 z-50 relative"
									onClick={() => {
										setCreate(true);
										setOpenCreateUpdateProject(true);
									}}
								>
									Create Project
									<PlusIcon size={20} />
								</div>
							)}

							{/* Option to invite a user */}
							{owner && (
								<div
									className={`flex items-center justify-center gap-2 text-xl text-center cursor-pointer hover:text-green-500 bg-green-900 text-white p-2 rounded-md z-50 relative ${
										projects.length < 3 ? "mt-2" : "mt-8"
									}`}
									onClick={() => setInvite(true)}
								>
									Invite User
									<UsersIcon size={20} />
								</div>
							)}
						</div>
					)}

					{/* Button to toggle the project menu */}
					<span
						className="absolute top-16 right-4"
						onClick={() => setIsPOpen(!isPOpen)}
					>
						<MenuSquareIcon size={36} />
					</span>

					{/* Chart navigation (radio buttons for chart type) */}
					<RadioChartNav chart={chart} setChart={setChart} />

					{/* Project name with edit icon */}
					<h2 className="text-5xl font-bold my-2 text-center flex gap-4 items-center">
						{projects[pNumber]?.name}
						{owner && (
							<PencilIcon
								className="hover:text-sky-500 mt-1"
								onClick={() => {
									setCreate(false);
									setOpenCreateUpdateProject(!createUpdateProject);
								}}
							/>
						)}
					</h2>

					{/* Chart rendering */}
					<div className="w-[93vw] md:w-[65] lg:w-[50] flex justify-center mt-2 z-0 relative">
						{chart === "linear" && <ChartLinear impacts={currentImpacts} />}
						{chart === "bar" && <ChartBar impacts={currentImpacts} />}
					</div>

					{/* Edit project data button */}
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
