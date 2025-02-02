"use client";

import { impactType } from "@/types";
import {
	CategoryScale,
	Chart as ChartJS,
	Filler,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from "chart.js";
import { useEffect, useMemo, useRef } from "react";
import { Line } from "react-chartjs-2";

// Register necessary components for the chart
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

function ChartLinear({ impacts }: { impacts: impactType[] }) {
	const chartRef = useRef<ChartJS<"line"> | null>(null);

	// Memoize the chart data to avoid recalculating on every render
	const data = useMemo(() => {
		return {
			labels: impacts.map(impact => impact.created_at),
			datasets: [
				{
					label: "Impacts",
					data: impacts.map(impact => impact.impactPercent),
					backgroundColor: "rgba(54, 162, 235, 0.5)",
					borderColor: "rgb(54, 162, 235)",
					borderWidth: 3,
					pointRadius: 6,
					pointBackgroundColor: "rgb(54, 162, 235)",
					fill: true,
				},
			],
		};
	}, [impacts]);

	// Chart options configuration
	const options = useMemo(() => {
		return {
			responsive: true,
			maintainAspectRatio: false, // Disables aspect ratio to stretch the chart vertically
			plugins: {
				legend: {
					display: false, // Hide legend for a cleaner look
				},
				tooltip: {
					enabled: true,
					backgroundColor: "rgba(0, 0, 0, 0.7)",
					titleFont: {
						size: 16,
						weight: "bold",
						family: "'Arial', sans-serif",
					},
					bodyFont: {
						size: 14,
						family: "'Arial', sans-serif",
					},
					padding: 12,
					caretSize: 8,
					cornerRadius: 6,
					displayColors: false,
				},
			},
			scales: {
				x: {
					ticks: {
						autoSkip: true,
						maxTicksLimit: 10, // Limit the number of X axis labels
					},
				},
				y: {
					beginAtZero: true, // Ensure the Y axis starts from 0
				},
			},
		};
	}, []);

	// Optimize window resize handling to avoid unnecessary re-renders
	useEffect(() => {
		const handleResize = () => {
			if (chartRef.current) {
				chartRef.current.update(); // Update chart when resizing window
			}
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []); // Empty dependency array means this effect runs once on mount

	return (
		<div className="w-full flex justify-center min-w-[575px]">
			<div className="w-full max-w-[1000px] p-4 bg-gray-800 rounded-lg flex flex-col items-center relative">
				<h2 className="w-full text-center text-lg font-bold text-white bg-gradient-to-r from-transparent via-sky-700 to-transparent py-2 px-4">
					Linear Chart
				</h2>

				{/* Ensure proper scroll behavior */}
				<div className="w-full overflow-x-auto md:overflow-x-scroll">
					<div className="w-full min-w-[1000px] md:w-[1000px] h-[300px] md:h-[350px] lg:h-[400px]">
						{/* Render the Line chart with memoized data and options */}
						<Line ref={chartRef} data={data} options={options} />
					</div>
				</div>
			</div>
		</div>
	);
}

export { ChartLinear };
