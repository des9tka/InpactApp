"use client";
import { useState } from "react";

function LoginForm() {
	const [isForgot, setIsForgot] = useState<boolean>(false);

	return (
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
						id="email"
						name="email"
						type="email"
						required
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
					<div className="text-sm flex justify-between items-center mr-2">
						<div className="text-sm flex justify-between items-center mr-2">
							<span
								className="font-semibold text-sky-500 hover:text-sky-300 mr-2 cursor-pointer"
								onClick={() => setIsForgot(!isForgot)}
							>
								Forgot password?
							</span>
							<div>
								<input
									type="checkbox"
									id="extraInfo"
									className="hidden peer"
									checked={isForgot}
									onChange={() => setIsForgot(!isForgot)}
								/>
								<label
									htmlFor="extraInfo"
									className="w-5 h-5 flex items-center justify-center bg-gray-300 rounded-md cursor-pointer peer-checked:bg-sky-500 transition-colors duration-200"
								></label>
							</div>
						</div>
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
	);
}

export { LoginForm };
