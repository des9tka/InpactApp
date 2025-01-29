"use client";
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	Title,
	Tooltip,
} from "chart.js";
import { useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend);

const ChartBar = () => {
	// Correct typing for chartRef to be compatible with react-chartjs-2
	const chartRef = useRef<ChartJS<"bar"> | null>(null);

	const barData = {
		labels: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Mar",
			"Apr",
			"May",
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
		],
		datasets: [
			{
				label: "Impacts",
				data: [
					15, 43, 32, 9, 25, 15, 43, 32, 9, 25, 15, 43, 32, 9, 25, 15, 43, 32,
					9, 25, 15, 43, 32, 9, 25, 15, 43, 32, 9, 25,
				],
				backgroundColor: "rgba(54, 162, 235, 0.5)",
				borderColor: "rgb(54, 162, 235)",
				borderWidth: 0.5,
			},
		],
	};

	const barOptions = {
		responsive: true,
		plugins: {
			legend: {
				display: true,
				position: "top" as const, // Fixing type mismatch
			},
		},
	};

	useEffect(() => {
		const handleResize = () => {
			if (chartRef && chartRef.current) {
				chartRef.current.update(); // Update chart if reference exists
			}
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div className="w-full p-4 bg-gray-800 rounded-lg flex-col justify-center items-center">
			<h2 className="text-center text-lg font-bold text-white">Bar Chart</h2>
			<div className="w-full h-full">
				<Bar ref={chartRef} data={barData} options={barOptions} />
			</div>
		</div>
	);
};

export { ChartBar };
