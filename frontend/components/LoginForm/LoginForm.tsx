"use client";
import { useState } from "react";

import { LoginForm, RegisterForm } from "@/components";

function Login() {
	const [isLogin, setIsLogin] = useState<boolean>(true);

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-900">
			<div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
				<div className="flex flex-col items-center space-y-6">
					<h2 className="text-center text-2xl font-bold tracking-tight text-sky-500">
						{isLogin ? "Enter in account" : "Create an account"}
					</h2>

					<div className="w-full">
						{isLogin ? <LoginForm /> : <RegisterForm />}
					</div>

					<p className="text-center text-sm text-gray-600">
						{isLogin ? "Not a member?" : "Already a member?"}
						<button
							className="font-semibold text-sky-500 hover:text-sky-300 ml-1"
							onClick={() => setIsLogin(!isLogin)}
						>
							{isLogin ? "Sign up" : "Sign in"}
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Login;
