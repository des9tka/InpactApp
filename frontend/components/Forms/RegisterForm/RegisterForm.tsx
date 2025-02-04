"use client";
import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Notification } from "@/components";
import { useAppDispatch, useAppSelector, userActions } from "@/redux";
import { authRegisterUserType } from "@/types";
import { authRegisterValidationSchema } from "@/validators";

function RegisterForm({
	isExtra,
	setIsExtra,
	setIsLogin,
}: {
	isExtra: boolean;
	setIsExtra: Function;
	setIsLogin: Function;
}) {
	const {
		errors: sliceErrors,
		loading,
		user,
	} = useAppSelector(state => state.userReducer);
	const dispatch = useAppDispatch();

	// State for showing success notification
	const [showNotification, setShowNotification] = useState<boolean>(false);

	// Show notification when user is registered and loading is false
	useEffect(() => {
		if (user && !loading && !sliceErrors) {
			setShowNotification(true);
		}
	}, [user, loading, sliceErrors]);

	// Formik hook to manage form state and validation
	const { values, handleBlur, errors, touched, handleChange, handleSubmit } =
		useFormik({
			initialValues: {
				email: "",
				username: "",
				password: "",
				name: "",
				surname: "",
			},
			validationSchema: authRegisterValidationSchema, // Validation schema
			onSubmit: (data: authRegisterUserType) => {
				dispatch(userActions.registerUser(data)); // Dispatch register action
			},
		});

	return (
		<div>
			{/* Success Notification */}
			{showNotification && (
				<Notification
					message="Success Register! Please, activate your account in email link."
					type="success"
					duration={3}
					isVisible={showNotification}
					setIsVisible={setShowNotification}
					endUpFunc={() => setIsLogin(true)} // Switch to login after success
				/>
			)}

			<form onSubmit={handleSubmit} method="POST" className="space-y-2">
				{/* Email Field */}
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
						{touched.email && errors.email && (
							<div className="text-sm text-red-500 text-center capitalize">
								{errors.email}
							</div>
						)}
					</div>
				</div>

				{/* Username Field */}
				<div>
					<label
						htmlFor="username"
						className="block text-sm/6 font-medium text-gray-300"
					>
						Username
					</label>
					<div className="mt-2">
						<input
							id="username"
							type="text"
							value={values.username}
							onChange={handleChange}
							onBlur={handleBlur}
							autoComplete="username"
							className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
						/>
						{touched.username && errors.username && (
							<div className="text-sm text-red-500 text-center capitalize">
								{errors.username}
							</div>
						)}
					</div>
				</div>

				{/* Conditionally Rendered Extra Info */}
				<div
					className={`overflow-hidden transition-[max-height] ease-in-out ${
						isExtra ? "max-h-screen duration-500" : "max-h-0 duration-200"
					}`}
				>
					{/* First Name Field */}
					<div className="mt-2">
						<label
							htmlFor="name"
							className="block text-sm/6 font-medium text-gray-300"
						>
							First Name
						</label>
						<div className="mt-2">
							<input
								id="name"
								type="text"
								value={values.name}
								onChange={handleChange}
								onBlur={handleBlur}
								className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
							/>
							{touched.name && errors.name && (
								<div className="text-sm text-red-500 text-center capitalize">
									{errors.name}
								</div>
							)}
						</div>
					</div>

					{/* Last Name Field */}
					<div className="mt-2">
						<label
							htmlFor="surname"
							className="block text-sm/6 font-medium text-gray-300"
						>
							Last Name
						</label>
						<div className="mt-2">
							<input
								id="surname"
								type="text"
								value={values.surname}
								onChange={handleChange}
								onBlur={handleBlur}
								className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
							/>
							{touched.surname && errors.surname && (
								<div className="text-sm text-red-500 text-center capitalize">
									{errors.surname}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Password Field */}
				<div>
					<div className="flex items-center justify-between">
						<label
							htmlFor="password"
							className="block text-sm/6 font-medium text-gray-300"
						>
							Password
						</label>
						<div className="text-sm flex justify-between items-center mr-2">
							{/* Toggle extra info */}
							<span
								className="font-semibold text-sky-500 hover:text-sky-300 mr-2 cursor-pointer"
								onClick={() => setIsExtra(!isExtra)}
							>
								Add profile info?
							</span>
							<div>
								<input
									type="checkbox"
									id="extraInfo"
									className="hidden peer"
									checked={isExtra}
									onChange={() => setIsExtra(!isExtra)}
								/>
								<label
									htmlFor="extraInfo"
									className="w-5 h-5 flex items-center justify-center bg-gray-300 rounded-md cursor-pointer peer-checked:bg-sky-500 transition-colors duration-200"
								></label>
							</div>
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
						{touched.password && errors.password && (
							<div className="text-sm text-red-500 text-center capitalize">
								{errors.password}
							</div>
						)}
					</div>
				</div>

				{/* Submit Button */}
				<div>
					<button
						type="submit"
						className={`flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
							loading ? "cursor-progress" : ""
						}`}
						disabled={loading} // Disable the button if loading
					>
						Sign up
						{loading && (
							<span className="ml-2 animate-spin">
								<Loader2 />
							</span>
						)}
					</button>
				</div>

				{/* Display Errors */}
				{sliceErrors && (
					<p className="text-red-500 text-center">{sliceErrors}</p>
				)}
			</form>
		</div>
	);
}

export { RegisterForm };
