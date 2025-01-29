"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { LoginForm, RegisterForm } from "@/components";

function LoginPage() {
	const [isLogin, setIsLogin] = useState<boolean>(true);
	const [isExtra, setIsExtra] = useState(false);

	return (
		<div className="flex justify-center items-center h-[100vh] ">
			<motion.div
				key={isLogin ? "login" : "register"}
				className="relative w-[375px] p-6 rounded-xl shadow-lg"
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.5 }}
				transition={{ duration: 0.3 }}
			>
				<div className="flex flex-col items-center space-y-6">
					<div className="w-full">
						<AnimatePresence mode="wait">
							{isLogin ? (
								<motion.div
									key="login"
									initial={{ opacity: 0, x: 50 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -50 }}
									transition={{ duration: 0.3 }}
								>
									<h2 className="text-center text-2xl font-bold tracking-tight text-sky-500 mb-8">
										Enter in account
									</h2>

									<LoginForm />

									<p className="text-center text-sm text-gray-600 mt-4">
										Not a member?
										<button
											className="font-semibold text-sky-500 hover:text-sky-300 ml-1"
											onClick={() => setIsLogin(!isLogin)}
										>
											Sign up
										</button>
									</p>
								</motion.div>
							) : (
								<motion.div
									key="register"
									initial={{ opacity: 0, x: -50 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 50 }}
									transition={{ duration: 0.3 }}
								>
									<h2 className="text-center text-2xl font-bold tracking-tight text-sky-500 mb-8">
										Create an account
									</h2>

									<RegisterForm
										isExtra={isExtra}
										setIsExtra={setIsExtra}
										setIsLogin={setIsLogin}
									/>

									<p className="text-center text-sm text-gray-600 mt-4">
										Already a member?
										<button
											className="font-semibold text-sky-500 hover:text-sky-300 ml-1"
											onClick={() => setIsLogin(!isLogin)}
										>
											Sign in
										</button>
									</p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

export default LoginPage;
