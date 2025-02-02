"use client";
import { impactType } from "@/types";
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	Title,
	Tooltip,
} from "chart.js";
import { useEffect, useMemo, useRef } from "react";
import { Bar } from "react-chartjs-2";

// Register necessary components for the chart
ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend);

const ChartBar = ({ impacts }: { impacts: impactType[] }) => {
	const chartRef = useRef<ChartJS<"bar"> | null>(null);

	// Memoize chart data and options to optimize rendering
	const barData = useMemo(() => {
		return {
			labels: impacts.map(impact => impact.created_at),
			datasets: [
				{
					label: "Impacts",
					data: impacts.map(impact => impact.impactPercent),
					backgroundColor: "rgba(54, 162, 235, 0.5)",
					borderColor: "rgb(54, 162, 235)",
					borderWidth: 0.5,
				},
			],
		};
	}, [impacts]);

	const barOptions = useMemo(() => {
		return {
			responsive: true,
			maintainAspectRatio: true,
			plugins: {
				legend: {
					display: false, // Hide legend for simplicity
				},
			},
		};
	}, []);

	// Optimize window resize handling to update chart only when necessary
	useEffect(() => {
		const handleResize = () => {
			if (chartRef.current) {
				chartRef.current.update(); // Update chart when resizing window
			}
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize); // Cleanup event listener
		};
	}, []); // Empty dependency array means this effect runs once on mount

	return (
		<div className="w-full flex justify-center min-w-[575px]">
			<div className="w-full max-w-[1000px] p-4 bg-gray-800 rounded-lg flex flex-col items-center relative">
				<h2 className="w-full text-center text-lg font-bold text-white bg-gradient-to-r from-transparent via-sky-700 to-transparent py-2 px-4">
					Bar Chart
				</h2>

				<div className="w-full overflow-x-auto md:overflow-x-scroll">
					<div className="w-full min-w-[1000px] md:w-[1000px] h-[300px] md:h-[350px] lg:h-[400px]">
						{/* Render the Bar chart with memoized data and options */}
						<Bar ref={chartRef} data={barData} options={barOptions} />
					</div>
				</div>
			</div>
		</div>
	);
};

export { ChartBar };
