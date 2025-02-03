"use client";
import { ChevronLeft, PlusIcon, Trash2, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import ImpactTable from "@/components/DataTable/ImpactTable";
import CreateImpactModal from "@/components/Forms/ImpactModal/CreateImpactModal";
import {
	impactActions,
	projectActions,
	useAppDispatch,
	useAppSelector,
} from "@/redux";
import { impactType, userType } from "@/types";

const DataPage: React.FC = () => {
	const [isImpactModalOpen, setIsImpactModalOpen] = useState(false); // State for impact modal
	const [isUsersModalOpen, setIsUsersModalOpen] = useState(false); // State for users modal
	const { impacts, isLoaded } = useAppSelector(state => state.impactReducer);
	const { users } = useAppSelector(state => state.projectReducer);
	const { user: self } = useAppSelector(state => state.userReducer);
	const dispatch = useAppDispatch();
	const param = useSearchParams();
	const [currentImpacts, setCurrentImpacts] = useState<impactType[]>([]); // Project-specific impacts

	const projectId = param?.get("project"); // Get projectId from URL params
	const router = useRouter();

	useEffect(() => {
		if (!projectId || isNaN(Number(projectId))) {
			router.push("/dashboard"); // Redirect to dashboard if projectId is invalid
			return;
		}

		const projectIdNum = parseInt(projectId, 10);

		// Fetch impacts only if not already loaded
		if (!impacts.length && !isLoaded) {
			dispatch(impactActions.getUserProjectImpacts(projectIdNum));
		}

		// Fetch users only if not already loaded
		if (!users.length && projectId) {
			dispatch(projectActions.getUsersFromProject(parseInt(projectId, 10)));
		}

		// Filter impacts to only show the ones related to the current project
		setCurrentImpacts(impacts.filter(i => i.project_id === projectIdNum));
	}, [param, impacts, isLoaded, dispatch, router]);

	// Fetch users when opening users modal
	const handleOpenUsersModal = () => {
		setIsUsersModalOpen(true);
		if (!users.length && projectId) {
			dispatch(projectActions.getUsersFromProject(parseInt(projectId, 10)));
		}
	};

	// Remove user from project
	const handleRemoveUser = (userId: number) => {
		if (projectId) {
			dispatch(
				projectActions.deleteUserFromProject({
					project_id: parseInt(projectId, 10),
					user_id: userId,
				})
			);
		}
	};

	return (
		<div className="p-4 flex flex-col items-center justify-center w-full mt-12">
			<h1 className="text-3xl font-bold mb-4">Data Table</h1>

			<div className="flex gap-4">
				{/* Create Impact Button */}
				<button
					onClick={() => setIsImpactModalOpen(true)}
					className="flex gap-2 items-center bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg"
				>
					Create Impact <PlusIcon size={16} />
				</button>

				{/* See Users Button */}
				<button
					onClick={handleOpenUsersModal}
					className="flex gap-2 items-center bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
				>
					See Users <Users size={16} />
				</button>
			</div>

			{/* Render Impact Table */}
			<ImpactTable
				users={users}
				impacts={currentImpacts}
				projectId={parseInt(projectId || "", 10)}
			/>

			{/* Create Impact Modal */}
			{projectId && (
				<CreateImpactModal
					isOpen={isImpactModalOpen}
					onClose={() => setIsImpactModalOpen(false)}
					projectId={projectId}
				/>
			)}

			{/* Users Modal */}
			{isUsersModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
						<h2 className="text-xl font-bold mb-4">Project Users</h2>
						{users.length ? (
							<ul className="space-y-2">
								{users.map((user: userType) => {
									if (user.id !== self?.id)
										return (
											<li
												key={user.id}
												className="flex justify-between items-center bg-gray-500 p-2 rounded"
											>
												<span>{user.email}</span>
												<button
													onClick={() => handleRemoveUser(user.id)}
													className="text-red-600 hover:text-red-800"
												>
													<Trash2 size={16} />
												</button>
											</li>
										);
								})}
							</ul>
						) : (
							<p>No users found.</p>
						)}

						{/* Close Modal Button */}
						<button
							onClick={() => setIsUsersModalOpen(false)}
							className="mt-4 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg w-full"
						>
							Close
						</button>
					</div>
				</div>
			)}

			{/* Back to Dashboard Button */}
			<button
				type="button"
				className="mt-4 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex gap-2 w-[150px]"
				onClick={() => router.push("/dashboard")}
			>
				<ChevronLeft /> See Charts
			</button>
		</div>
	);
};

export default DataPage;
