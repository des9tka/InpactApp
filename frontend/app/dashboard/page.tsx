"use client";
import { InvitedProjects, UserProjects } from "@/components";
import { projectActions, useAppDispatch, useAppSelector } from "@/redux";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function DashboardPage() {
	const [page, setPage] = useState(0);

	const paginate = (direction: number) => {
		setPage(prev => (prev + direction + 2) % 2);
	};

	const dispatch = useAppDispatch();
	const mounted = useRef(false);
	const { my_projects, projects } = useAppSelector(
		state => state.projectReducer
	);

	useEffect(() => {
		if (!mounted.current) {
			dispatch(projectActions.getUserProjects());
			dispatch(projectActions.getInvitedProjects());
			mounted.current = true;
		}
	}, [my_projects, projects]);

	return (
		<div className="flex flex-col justify-center items-center min-h-screen w-[100vw] overflow-hidden relative">
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
						<div className={page === 0 ? "block" : "hidden"}>
							<UserProjects />
						</div>
						<div className={page === 1 ? "block" : "hidden"}>
							<InvitedProjects />
						</div>
					</motion.div>
				</AnimatePresence>
			</div>
			<div className="z-20 absolute top-1/2 left-4 transform -translate-y-1/2">
				<button
					onClick={() => paginate(-1)}
					className="p-2 rounded-full bg-gray-900 hover:bg-gray-700"
				>
					<ChevronLeft size={32} />
				</button>
			</div>
			<div className="z-20 absolute top-1/2 right-4 transform -translate-y-1/2">
				<button
					onClick={() => paginate(1)}
					className="p-2 rounded-full bg-gray-900 hover:bg-gray-700"
				>
					<ChevronRight size={32} />
				</button>
			</div>
		</div>
	);
}

export default DashboardPage;
