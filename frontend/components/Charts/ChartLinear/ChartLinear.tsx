"use client";

import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

function ChartLinear() {
	const data = {
		labels: ["Jan", "Feb", "Mar", "Apr", "May"],
		datasets: [
			{
				label: "Impacts",
				data: [15, 43, 32, 9, 25],
				borderColor: "rgb(54, 162, 235)",
				backgroundColor: "rgba(54, 162, 235, 0.5)",
				tension: 0.4,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: true,
				position: "top" as const,
			},
		},
	};

	return (
		<div className="h-[350px] p-4 bg-gray-800 flex-col justify-center">
			<h2 className="text-center text-lg font-bold text-white mb-4">
				{"{ProjectName}"} Impacts
			</h2>
			<Line data={data} options={options} />
		</div>
	);
}

export { ChartLinear };
