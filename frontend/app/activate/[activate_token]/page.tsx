"use client";
import { useEffect, useRef } from "react";

import { Loader } from "@/components";
import { useAppDispatch, useAppSelector, userActions } from "@/redux";
import { useParams, useRouter } from "next/navigation";

function ActivateTokenPage() {
	const params = useParams();
	const router = useRouter();
	const activate_token = params.activate_token as string;

	const dispatch = useAppDispatch();
	const { loading, errors, extra } = useAppSelector(state => state.userReducer);
	const hasFetched = useRef(false);

	// useEffect to activate the user based on the token, only triggered once
	useEffect(() => {
		if (activate_token && !hasFetched.current) {
			dispatch(userActions.activateUser(activate_token));
			hasFetched.current = true;
		}
	}, [activate_token, dispatch]); // Added `activate_token` and `dispatch` as dependencies

	return (
		<div className="flex justify-center items-center w-full h-[100vh] text-3xl">
			{/* Show loader if the request is pending */}
			{loading && <Loader />}

			{/* Show error message if there's any error */}
			{errors && <div className="text-center text-red-700">{errors}</div>}

			{/* Display the success message and the button to go to the login page */}
			{extra && (
				<div className="font-bold flex flex-col justify-center items-center text-center">
					<p>{extra}</p>
					<button
						type="button"
						className="mt-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 flex gap-2"
						onClick={() => router.push("/login")}
					>
						Go to Login
					</button>
				</div>
			)}
		</div>
	);
}

export default ActivateTokenPage;
