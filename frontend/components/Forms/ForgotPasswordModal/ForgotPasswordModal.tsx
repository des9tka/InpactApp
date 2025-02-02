"use client";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector, userActions } from "@/redux";
import { RecoveryRequestType, RecoveryType } from "@/types";
import { recoveryPasswordValidationSchema } from "@/validators";

// Prop types for the component
interface ForgotPasswordModalProps {
	setIsForgot: (value: boolean) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
	setIsForgot,
}) => {
	// State to check if the recovery code has been sent
	const [isSendedCode, setIsSendedCode] = useState<boolean>(false);

	const dispatch = useAppDispatch();
	const { errors: sliceErrors, extra } = useAppSelector(
		state => state.userReducer
	);

	// Function to send a recovery code request
	const sendRecoveryCode = async (data: RecoveryRequestType) => {
		// Dispatch the action to request a recovery password code
		await dispatch(userActions.requestRecoveryPassword(data)).unwrap();
		setIsSendedCode(true); // Set the flag to true after the code is sent successfully
	};

	// Function to send the password along with the recovery token
	const sendPasswordWithCode = async (data: RecoveryType) => {
		// Check if recovery_token and password are provided before submitting
		if (!data.recovery_token || !data.password) {
			formik.setFieldError(
				"recovery_token",
				"Recovery token and password are required."
			);
			return;
		}
		// Trim spaces from the input fields before sending the data
		data.recovery_token = data.recovery_token.trim();
		data.password = data.password.trim();

		// Dispatch the action to recover the password
		await dispatch(userActions.recoveryPassword(data)).unwrap();
	};

	// Formik setup for handling form submission and validation
	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
			recovery_token: "",
		},
		validationSchema: recoveryPasswordValidationSchema, // Validation schema to ensure correct data input
		onSubmit: values => {
			// Check if the code is sent and proceed with the appropriate function
			if (isSendedCode) sendPasswordWithCode(values as RecoveryType);
			else sendRecoveryCode(values as RecoveryRequestType);
		},
	});

	// Handling slice errors from the Redux store and setting form errors
	useEffect(() => {
		if (sliceErrors) {
			Object.entries(sliceErrors).forEach(([field, message]) => {
				formik.setFieldError(field, message as string); // Set form errors if any exist
			});
		}
	}, [sliceErrors]);

	return (
		<div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
			<motion.div
				className="div"
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.3 }}
			>
				<div className="bg-gray-700 px-6 py-4 rounded-lg w-96 shadow-lg">
					<h2 className="text-center text-2xl font-bold tracking-tight text-sky-500 mb-8">
						Recovery password
					</h2>

					<form onSubmit={formik.handleSubmit} className="space-y-4">
						{/* If the code hasn't been sent yet */}
						{!isSendedCode ? (
							<div>
								<div className="flex justify-between mb-1">
									<label className="block text-sm font-medium text-gray-300">
										Email address
									</label>
									<label className="flex gap-1 items-center text-sky-300">
										Sent?
										<div>
											<input
												type="checkbox"
												id="extraInfo"
												className="hidden peer"
												checked={isSendedCode}
												onChange={() => setIsSendedCode(!isSendedCode)} // Toggle sending code state
											/>
											<label
												htmlFor="extraInfo"
												className="w-5 h-5 flex items-center justify-center bg-gray-300 rounded-md cursor-pointer peer-checked:bg-sky-500 transition-colors duration-200"
											></label>
										</div>
									</label>
								</div>
								<input
									type="email"
									name="email"
									value={formik.values.email}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-sky-600"
								/>
								{formik.touched.email && formik.errors.email && (
									<p className="text-red-500 text-xs mt-1 text-center">
										{formik.errors.email}
									</p>
								)}
								<div className="flex justify-evenly gap-2">
									<button
										type="submit"
										className="mt-4 w-full rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
									>
										Send Code
									</button>
									<button
										className="mt-4 w-full rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
										onClick={() => {
											dispatch(userActions.setError(null)); // Reset errors when closing
											setIsForgot(false); // Close the modal
										}}
									>
										Cancel
									</button>
								</div>
							</div>
						) : (
							<>
								{/* If the code has been sent, display the recovery token and new password fields */}
								<div>
									<label className="block text-sm font-medium text-gray-300">
										Recovery Token
									</label>
									<input
										type="text"
										name="recovery_token"
										value={formik.values.recovery_token}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-sky-600"
									/>
									{formik.errors.recovery_token && (
										<p className="text-red-500 text-xs mt-1 text-center">
											{formik.errors.recovery_token}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-300">
										New Password
									</label>
									<input
										type="password"
										name="password"
										value={formik.values.password}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-sky-600"
									/>
									{formik.errors.password && (
										<p className="text-red-500 text-xs mt-1 text-center">
											{formik.errors.password}
										</p>
									)}
								</div>
								<div className="flex justify-evenly gap-2">
									<button
										type="submit"
										className="mt-4 w-full rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-green-600"
									>
										Submit
									</button>
									<button
										className="mt-4 w-full rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
										onClick={() => {
											dispatch(userActions.setError(null)); // Reset errors when closing
											setIsForgot(false); // Close the modal
										}}
									>
										Cancel
									</button>
								</div>
							</>
						)}
						{/* Display additional success or error messages */}
						{extra && <p className="text-center text-green-600">{extra}</p>}
						{sliceErrors && (
							<p className="text-center text-red-600">{sliceErrors}</p>
						)}
					</form>
				</div>
			</motion.div>
		</div>
	);
};

export { ForgotPasswordModal };
