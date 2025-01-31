"use client";
import { useAppDispatch, useAppSelector, userActions } from "@/redux";
import { RecoveryRequestType, RecoveryType } from "@/types"
import { recoveryPasswordValidationSchema } from "@/validators";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { useState } from "react";

function ForgotPasswordModal({ setIsForgot }: { setIsForgot: Function }) {
	const [isSendedCode, setIsSendedCode] = useState<boolean>(false);

	const dispatch = useAppDispatch();
	const { errors: sliceErrors } = useAppSelector(state => state.userReducer);

	const sendRecoveryCode = () => {
		setIsSendedCode(true);
		dispatch(userActions.recoveryPasswordRequest());
	};

	const sendPasswordWithCode = () => {
		dispatch(userActions.recoveryPassword());
	};

	const { values, handleBlur, errors, touched, handleChange, handleSubmit } =
		useFormik({
			initialValues: {
				email: "",
				password: "",
			},
			validationSchema: recoveryPasswordValidationSchema,
			onSubmit: (data: RecoveryRequestType | RecoveryType) => {
				dispatch(userActions.loginUser(data)).then(() => {
					if (!sliceErrors && cookieService.getCookieAccessRefreshTokens())
						router.push("/dashboard");
				});
			},
		});

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

					<form action="#" method="POST" className="space-y-4">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-300"
							>
								Email address
							</label>
							<div className="mt-2">
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-sky-600"
								/>
							</div>
						</div>

						<div className="flex items-center justify-evenly gap-4">
							<button
								onClick={e => e.preventDefault()}
								className="flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
							>
								Send Code
							</button>

							<button
								onClick={() => setIsForgot(false)}
								className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</motion.div>
		</div>
	);
}

export { ForgotPasswordModal };
