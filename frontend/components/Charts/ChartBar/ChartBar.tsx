"use client";
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	Title,
	Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend);

const ChartBar = () => {
	const barData = {
		labels: ["Jan", "Feb", "Mar", "Apr", "May"],
		datasets: [
			{
				label: "Impacts",
				data: [15, 43, 32, 9, 25],
				backgroundColor: "rgba(54, 162, 235, 0.5)",
				borderColor: "rgb(54, 162, 235)",
				borderWidth: 1,
			},
		],
	};

	const barOptions = {
		responsive: true,
		plugins: {
			legend: {
				display: true,
				position: "top" as const,
			},
		},
	};

	return (
		<div className="h-[350px] p-4 bg-gray-800 rounded-lg">
			<h2 className="text-center text-lg font-bold text-white mb-4">
				Bar Chart
			</h2>
			<Bar data={barData} options={barOptions} />
		</div>
	);
};

export { ChartBar };
