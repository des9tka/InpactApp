"use client";
import { ForgotPasswordModal } from "@/components";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

function LoginForm() {
	const [isForgot, setIsForgot] = useState<boolean>(false);

	return (
		<div className="relative">
			<AnimatePresence>
				{isForgot && <ForgotPasswordModal setIsForgot={setIsForgot} />}
			</AnimatePresence>

			<form action="#" method="POST" className="space-y-2">
				<div>
					<label
						htmlFor="email"
						className="block text-sm/6 font-medium text-gray-300"
					>
						Email address
					</label>
					<div className="mt-2">
						<input
							autoComplete="email"
							className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
						/>
					</div>
				</div>

				<div>
					<div className="flex items-center justify-between">
						<label
							htmlFor="password"
							className="block text-sm/6 font-medium text-gray-300"
						>
							Password
						</label>
						<div className="text-sm flex justify-between items-center">
							<span
								className="font-semibold text-sky-500 hover:text-sky-300 mr-2 cursor-pointer"
								onClick={() => setIsForgot(true)}
							>
								Forgot password?
							</span>
						</div>
					</div>
					<div className="mt-2">
						<input
							id="password"
							name="password"
							type="password"
							required
							autoComplete="current-password"
							className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600 sm:text-sm/6"
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						className="flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Sign in
					</button>
				</div>
			</form>
		</div>
	);
}

export { LoginForm };
