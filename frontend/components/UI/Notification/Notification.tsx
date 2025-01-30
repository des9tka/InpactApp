"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

function Notification({
	message = "Message",
	type = "success",
	duration = 5,
	isVisible,
	setIsVisible,
	endUpFunc,
}: {
	message?: string;
	type?: "success" | "error";
	duration?: number;
	isVisible: boolean;
	setIsVisible: Function;
	endUpFunc?: Function;
}) {
	const [progress, setProgress] = useState(100);

	const colors = {
		success: "bg-green-500",
		error: "bg-red-500",
	};

	useEffect(() => {
		if (!isVisible) return;

		const timer = setTimeout(() => {
			setIsVisible(false);
			endUpFunc && endUpFunc();
		}, duration * 1000);

		setProgress(0);

		return () => clearTimeout(timer);
	}, [isVisible, duration]);

	const handleClose = () => {
		setIsVisible(false);
	};

	if (!isVisible) {
		return null;
	}

	return (
		<div
			className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md z-50`}
		>
			<div
				className={`relative flex items-center justify-between p-4 text-white rounded shadow-lg ${colors[type]}`}
			>
				<span className="text-sm font-medium text-center w-full">
					{message}
				</span>
				<button
					onClick={handleClose}
					className="ml-4 text-white hover:text-gray-200 focus:outline-none"
				>
					<X />
				</button>
				<div
					className="absolute bottom-0 left-0 h-1 bg-white transition-all duration-[linear]"
					style={{
						width: `${progress}%`,
						transition: `width ${duration}s linear`,
					}}
				></div>
			</div>
		</div>
	);
}

export { Notification };
