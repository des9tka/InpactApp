"use client";
import { useEffect, useRef } from "react";

import { Loader } from "@/components";
import { projectActions, useAppDispatch, useAppSelector } from "@/redux";
import { useParams, useRouter } from "next/navigation";

function InviteTokenPage() {
	const params = useParams();
	const router = useRouter();
	const invite_token = params.invite_token as string;

	const dispatch = useAppDispatch();

	const { loading, errors, extra } = useAppSelector(
		state => state.projectReducer
	);
	const hasFetched = useRef(false); // Ref to ensure the API call is made only once

	// useEffect to trigger the API call once when the component mounts
	useEffect(() => {
		if (invite_token && !hasFetched.current) {
			dispatch(projectActions.joinTeam(invite_token));
			hasFetched.current = true; // Prevents repeated dispatching
		}
	}, [invite_token, dispatch]); // Dependencies: invite_token and dispatch to avoid unnecessary re-renders

	return (
		<div className="flex justify-center items-center w-full h-[100vh] text-3xl">
			{/* Show loader while request is in progress */}
			{loading && <Loader />}

			{/* Show error message if there are any errors */}
			{errors && <div className="text-center text-red-700">{errors}</div>}

			{/* Display success message and button to redirect to the dashboard */}
			{extra && (
				<div className="font-bold flex flex-col justify-center items-center text-center">
					<p>{extra}</p>
					<button
						type="button"
						className="mt-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 flex gap-2"
						onClick={() => router.push("/dashboard")}
					>
						Go to Dashboard
					</button>
				</div>
			)}
		</div>
	);
}

export default InviteTokenPage;
