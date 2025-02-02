"use client";
import { InvitedProjects, UserProjects } from "@/components";
import { projectActions, useAppDispatch, useAppSelector } from "@/redux";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function DashboardPage() {
	// State for page navigation
	const [page, setPage] = useState<number>(0);

	// Function for pagination
	const paginate = (direction: number) => {
		// Update the page with cyclic transition
		setPage(prev => (prev + direction + 2) % 2);
	};

	// Dispatch function for sending actions
	const dispatch = useAppDispatch();

	// useRef to prevent rerunning useEffect on initial render
	const mounted = useRef(false);

	// Extract user and invited projects from the global state
	const { my_projects, projects } = useAppSelector(
		state => state.projectReducer
	);

	// Fetch data on component mount
	useEffect(() => {
		if (!mounted.current) {
			// Dispatch actions to get user projects and invited projects
			dispatch(projectActions.getUserProjects());
			dispatch(projectActions.getInvitedProjects());
			mounted.current = true; // Set flag that the component is mounted
		}
	}, [dispatch]); // Add dispatch as dependency to avoid unnecessary rerenders

	return (
		<div className="flex flex-col justify-center items-center min-h-screen w-[100vw] overflow-hidden relative">
			{/* Container for animation of project page transition */}
			<div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
				<AnimatePresence mode="wait">
					<motion.div
						key={page}
						initial={{ x: 100, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: -100, opacity: 0 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="absolute w-full h-full flex items-center justify-center"
					>
						{/* Display the current page: either user projects or invited projects */}
						<div className={page === 0 ? "block" : "hidden"}>
							<UserProjects />
						</div>
						<div className={page === 1 ? "block" : "hidden"}>
							<InvitedProjects />
						</div>
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Button for navigating to the previous page */}
			<div className="z-20 absolute top-1/2 left-4 transform -translate-y-1/2">
				<button
					onClick={() => paginate(-1)} // Navigate to previous page
					className="p-2 rounded-full bg-gray-900 hover:bg-gray-700"
				>
					<ChevronLeft size={32} />
				</button>
			</div>

			{/* Button for navigating to the next page */}
			<div className="z-20 absolute top-1/2 right-4 transform -translate-y-1/2">
				<button
					onClick={() => paginate(1)} // Navigate to next page
					className="p-2 rounded-full bg-gray-900 hover:bg-gray-700"
				>
					<ChevronRight size={32} />
				</button>
			</div>
		</div>
	);
}

export default DashboardPage;
