import { projectActions, useAppDispatch, useAppSelector } from "@/redux";
import { motion } from "framer-motion";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { useState } from "react";

function InviteUserModal({
	setInvite,
	projectId,
}: {
	setInvite: Function;
	projectId: number;
}) {
	const dispatch = useAppDispatch();

	const [inputValue, setInputValue] = useState<string>("");
	const [userSee, setUserSee] = useState<boolean>(false);

	const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
		null
	);

	const { user, loading, extra, errors } = useAppSelector(
		state => state.projectReducer
	);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setInputValue(value);

		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		const timer = setTimeout(() => {
			let trimmedInput = value.trim();
			if (trimmedInput.startsWith("@")) {
				trimmedInput = trimmedInput.split("@")[1];
				dispatch(projectActions.getUserForInvite({ username: trimmedInput }));
			} else {
				dispatch(projectActions.getUserForInvite({ email: trimmedInput }));
			}
		}, 2000);

		setDebounceTimer(timer);
	};

	return (
		<div className="z-30 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
			<motion.div
				className="div"
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.3 }}
			>
				<div className="bg-gray-700 px-6 py-4 rounded-lg w-96 shadow-lg">
					<h2 className="text-center text-2xl font-bold tracking-tight text-sky-500 mb-8">
						Invite User
					</h2>

					<form className="space-y-4">
						<div>
							<div className="flex justify-between mb-2 items-center">
								<label className="block text-sm font-medium text-gray-300">
									Email or @Username
								</label>

								{user && (
									<label
										className="bg-sky-700 text-white px-2 py-2 rounded-md text-sm mr-6 hover:bg-sky-500 cursor-pointer relative"
										onMouseEnter={() => setUserSee(true)}
										onMouseLeave={() => setUserSee(false)}
									>
										{userSee && user && (
											<div
												className="absolute -top-16 -right-4 bg-gray-900 opacity-85 flex-col flex justify-center items-center px-4 py-2 rounded-md"
												onClick={() =>
													dispatch(
														projectActions.inviteUser({
															project_id: projectId,
															user_id: user.id,
														})
													)
												}
											>
												<span>{user.email}</span>
												<span>@{user.username}</span>
											</div>
										)}
										{inputValue.startsWith("@")
											? "@" + user?.username?.slice(0, 15) + "..."
											: user?.email?.slice(0, 15) + "..."}
									</label>
								)}
								{loading && (
									<Loader2Icon
										size={20}
										className="animate-spin text-sky-500 mr-6"
									/>
								)}
								{extra && (
									<span className="text-center text-yellow-700">{extra}</span>
								)}
								{errors && (
									<span className="text-center text-red-700">{errors}</span>
								)}
							</div>

							<div className="flex items-center gap-2">
								<input
									type="text"
									value={inputValue}
									onChange={handleInputChange}
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-sky-600"
									placeholder="Search by email or username"
								/>
								<SearchIcon size={20} className="text-gray-500" />
							</div>
							<div className="w-full justify-center flex">
								<button
									onClick={() => setInvite(false)}
									className="bg-gray-600 px-4 py-2 mt-2 w-[100px] rounded-md hover:bg-gray-500 content-center"
								>
									Cancel
								</button>
							</div>
						</div>
					</form>
				</div>
			</motion.div>
		</div>
	);
}

export { InviteUserModal };
