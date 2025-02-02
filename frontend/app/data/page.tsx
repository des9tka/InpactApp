"use client";
import { ChevronLeft, PlusIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import ImpactTable from "@/components/DataTable/ImpactTable";
import CreateImpactModal from "@/components/Forms/ImpactModal/CreateImpactModal";
import { impactActions, useAppDispatch, useAppSelector } from "@/redux";
import { impactType } from "@/types";

const DataPage: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
	const { impacts, isLoaded } = useAppSelector(state => state.impactReducer);
	const dispatch = useAppDispatch();
	const param = useSearchParams();
	const [currentImpacts, setCurrentImpacts] = useState<impactType[]>([]); // Impacts specific to the project

	const projectId = param?.get("project"); // Get projectId from URL params
	const router = useRouter();

	// Fetch impacts data when projectId changes or when impacts list is empty
	useEffect(() => {
		const projectIdFromQuery = param?.get("project");

		if (!projectIdFromQuery || isNaN(Number(projectIdFromQuery))) {
			router.push("/dashboard"); // Redirect to dashboard if projectId is invalid
			return;
		}

		if (!projectId || (isLoaded && !dispatch)) return;

		const projectIdNum = parseInt(projectIdFromQuery, 10);

		// Fetch impacts only if not already loaded
		if (!impacts.length) {
			dispatch(impactActions.getUserProjectImpacts(projectIdNum));
		}

		// Filter impacts to only show the ones related to the current project
		setCurrentImpacts(impacts.filter(i => i.project_id === projectIdNum));
	}, [param, impacts, dispatch, router]);

	return (
		<div className="p-4 flex flex-col items-center justify-center w-full mt-12">
			<h1 className="text-3xl font-bold mb-4">Data Table</h1>

			{/* Button to trigger modal for creating a new impact */}
			<button
				onClick={() => setIsModalOpen(true)} // Set modal state to open
				className="my-2 flex gap-2 items-center bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg"
			>
				Create Impact <PlusIcon size={16} />
			</button>

			{/* Render Impact Table with filtered impacts */}
			<ImpactTable
				impacts={currentImpacts}
				projectId={parseInt(projectId || "", 10)}
			/>

			{/* Conditionally render CreateImpactModal if projectId exists */}
			{projectId && (
				<CreateImpactModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)} // Close modal when user clicks on close
					projectId={projectId} // Pass projectId to modal
				/>
			)}

			{/* Button to navigate back to the dashboard */}
			<button
				type="button"
				className="mt-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex gap-2 w-[150px]"
				onClick={() => router.push("/dashboard")} // Navigate to dashboard
			>
				<ChevronLeft /> See Charts
			</button>
		</div>
	);
};

export default DataPage;
