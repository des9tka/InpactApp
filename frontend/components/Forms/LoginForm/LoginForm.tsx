"use client";
import { useFormik } from "formik";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { ForgotPasswordModal } from "@/components";
import { useAppDispatch, useAppSelector, userActions } from "@/redux";
import { cookieService } from "@/services/cookieService";
import { authLoginUserType } from "@/types";
import { authLoginValidationSchema } from "@/validators";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
	const { errors: sliceErrors, loading } = useAppSelector(
		state => state.userReducer
	);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const param = useSearchParams();

	// State to manage Forgot Password modal visibility
	const [isForgot, setIsForgot] = useState<boolean>(false);

	// Formik hook to handle form state and validation
	const { values, handleBlur, errors, touched, handleChange, handleSubmit } =
		useFormik({
			initialValues: {
				email: "",
				password: "",
			},
			validationSchema: authLoginValidationSchema, // Validation schema
			onSubmit: (data: authLoginUserType) => {
				// Dispatch login action
				dispatch(userActions.loginUser(data)).then(() => {
					// Redirect to dashboard if login is successful and tokens are present
					if (!sliceErrors && cookieService.getCookieAccessRefreshTokens()) {
						router.push("/dashboard");
					}
				});
			},
		});

	return (
		<div className="relative">
			{/* Display Forgot Password Modal if triggered */}
			<AnimatePresence>
				{isForgot && <ForgotPasswordModal setIsForgot={setIsForgot} />}
			</AnimatePresence>

			{/* Login Form */}
			<form
				onSubmit={e => {
					e.preventDefault();
					handleSubmit(); // Prevent default and trigger Formik's handleSubmit
				}}
				method="POST"
				className="space-y-2"
			>
				{/* Email Input */}
				<div>
					<label
						htmlFor="email"
						className="block text-sm/6 font-medium text-gray-300"
					>
						Email address
					</label>
					<div className="mt-2">
						<input
							id="email"
							type="text"
							value={values.email}
							onChange={handleChange}
							onBlur={handleBlur}
							autoComplete="email"
							className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
						/>
					</div>
					{/* Email Validation Error */}
					{touched.email && errors.email && (
						<div className="text-sm text-red-500 text-center capitalize">
							{errors.email}
						</div>
					)}
				</div>

				{/* Password Input */}
				<div>
					<div className="flex items-center justify-between">
						<label
							htmlFor="password"
							className="block text-sm/6 font-medium text-gray-300"
						>
							Password
						</label>
						<div className="text-sm flex justify-between items-center">
							{/* Forgot Password Link */}
							<span
								className="font-semibold text-sky-500 hover:text-sky-300 mr-2 cursor-pointer"
								onClick={() => setIsForgot(true)} // Toggle Forgot Password modal
							>
								Forgot password?
							</span>
						</div>
					</div>
					<div className="mt-2">
						<input
							id="password"
							type="text"
							value={values.password}
							onChange={handleChange}
							onBlur={handleBlur}
							autoComplete="current-password"
							className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
						/>
					</div>
					{/* Password Validation Error */}
					{touched.password && errors.password && (
						<div className="text-sm text-red-500 text-center capitalize">
							{errors.password}
						</div>
					)}
				</div>

				{/* Submit Button */}
				<div>
					<button
						type="submit"
						className={`flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
							loading ? "cursor-progress" : ""
						}`}
						disabled={loading} // Disable button when loading
					>
						Sign in
						{/* Loader Animation if loading */}
						{loading && (
							<span className="ml-2 animate-spin">
								<Loader2 />
							</span>
						)}
					</button>
				</div>

				{/* Display Error Messages if any */}
				{sliceErrors && !isForgot && (
					<p className="text-red-500 text-center">{sliceErrors}</p>
				)}
				{param.get("expired") && (
					<div className="text-yellow-500 text-center">Session is expired</div>
				)}
			</form>
		</div>
	);
}

export { LoginForm };
