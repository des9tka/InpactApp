"use client";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector, userActions } from "@/redux";
import { RecoveryRequestType, RecoveryType } from "@/types";
import { recoveryPasswordValidationSchema } from "@/validators";

function ForgotPasswordModal({ setIsForgot }: { setIsForgot: Function }) {
	const [isSendedCode, setIsSendedCode] = useState<boolean>(false);

	const dispatch = useAppDispatch();
	const { errors: sliceErrors, extra } = useAppSelector(
		state => state.userReducer
	);

	const sendRecoveryCode = async (data: RecoveryRequestType) => {
		await dispatch(userActions.requestRecoveryPassword(data)).unwrap();
		setIsSendedCode(true);
	};

	const sendPasswordWithCode = async (data: RecoveryType) => {
		if (!data.recovery_token) {
			formik.setFieldError("recovery_token", "Recovery token required.");
			return;
		}
		if (!data.password) {
			formik.setFieldError("password", "Password required.");
			return;
		}
		data.recovery_token = data.recovery_token.trim();
		data.password = data.password.trim();

		await dispatch(userActions.recoveryPassword(data)).unwrap();
		setIsForgot(false);
	};

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
			recovery_token: "",
		},
		validationSchema: recoveryPasswordValidationSchema,
		onSubmit: values => {
			if (isSendedCode) sendPasswordWithCode(values as RecoveryType);
			else sendRecoveryCode(values as RecoveryRequestType);
		},
	});

	useEffect(() => {
		if (sliceErrors) {
			Object.entries(sliceErrors).forEach(([field, message]) => {
				formik.setFieldError(field, message as string);
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
						{!isSendedCode ? (
							<div>
								<div className="flex justify-between">
									<label className="block text-sm font-medium text-gray-300">
										Email address
									</label>
									<label className="flex gap-1 items-center text-sky-300">
										Sended?
										<div>
											<input
												type="checkbox"
												id="extraInfo"
												className="hidden peer"
												checked={isSendedCode}
												onChange={() => setIsSendedCode(!isSendedCode)}
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
											dispatch(userActions.setError(null));
											setIsForgot(false);
										}}
									>
										Cancel
									</button>
								</div>
							</div>
						) : (
							<>
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
											dispatch(userActions.setError(null));
											setIsForgot(false);
										}}
									>
										Cancel
									</button>
								</div>
							</>
						)}
						{extra && <p className="text-center text-green-600">{extra}</p>}
						{sliceErrors && (
							<p className="text-center text-red-600">{sliceErrors}</p>
						)}
					</form>
				</div>
			</motion.div>
		</div>
	);
}

export { ForgotPasswordModal };
