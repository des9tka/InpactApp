"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

function Notification({
	message = "Message", // Default message
	type = "success", // Type of notification (success or error)
	duration = 5, // Duration in seconds
	isVisible, // Determines visibility of the notification
	setIsVisible, // Function to control visibility state
	endUpFunc, // Optional function to call after the notification ends
}: {
	message?: string;
	type?: "success" | "error";
	duration?: number;
	isVisible: boolean;
	setIsVisible: Function;
	endUpFunc?: Function;
}) {
	// State for managing the progress bar
	const [progress, setProgress] = useState(100);

	// Notification color based on type
	const colors = {
		success: "bg-green-500",
		error: "bg-red-500",
	};

	useEffect(() => {
		// If the notification is visible, start the timer and progress
		if (!isVisible) return;

		// Set a timeout to hide the notification after the specified duration
		const timer = setTimeout(() => {
			setIsVisible(false);
			endUpFunc && endUpFunc(); // Call the callback function if provided
		}, duration * 1000);

		// Set progress to 0 when the notification is triggered
		setProgress(0);

		// Cleanup function to clear the timeout if component unmounts or isHidden changes
		return () => clearTimeout(timer);
	}, [isVisible, duration, setIsVisible, endUpFunc]);

	const handleClose = () => {
		setIsVisible(false); // Close the notification when the close button is clicked
	};

	// Return null if the notification is not visible
	if (!isVisible) {
		return null;
	}

	return (
		<div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md z-50">
			{/* Notification container */}
			<div
				className={`relative flex items-center justify-between p-4 text-white rounded shadow-lg ${colors[type]}`}
			>
				{/* Message */}
				<span className="text-sm font-medium text-center w-full">
					{message}
				</span>

				{/* Close button */}
				<button
					onClick={handleClose}
					className="ml-4 text-white hover:text-gray-200 focus:outline-none"
				>
					<X />
				</button>

				{/* Progress bar */}
				<div
					className="absolute bottom-0 left-0 h-1 bg-white transition-all duration-[linear]"
					style={{
						width: `${progress}%`,
						transition: `width ${duration}s linear`, // Animate the progress bar
					}}
				></div>
			</div>
		</div>
	);
}

export { Notification };
