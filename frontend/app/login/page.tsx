"use client";
import { useState } from "react";

import { LoginForm, RegisterForm } from "@/components";

function Login() {
	const [isLogin, setIsLogin] = useState<boolean>(true);
	const [isExtra, setIsExtra] = useState(false);

	return (
		<div className="flex justify-center items-center h-[100vh]">
			<div
				className={`w-[375px] h-[450px] rounded-xl transition-all duration-300 ${isExtra && !isLogin? "mb-64" : "mb-16"}`}>

				<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8 auth-box rounded-xl">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						<h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-sky-500">
							{isLogin ? "Enter in account" : "Create an account"}
						</h2>
					</div>

					<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
						{isLogin ? (
							<LoginForm />
						) : (
							<RegisterForm isExtra={isExtra} setIsExtra={setIsExtra} />
						)}

						<p className="mt-10 text-center text-sm/6 text-gray-300">
							{isLogin ? "Not a member?" : "Already a member?"}
							<button
								className="font-semibold text-sky-500 hover:text-sky-100 ml-1"
								onClick={() => setIsLogin(!isLogin)}
							>
								{isLogin ? "Sign up" : "Sign in"}
							</button>
						</p>

					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
