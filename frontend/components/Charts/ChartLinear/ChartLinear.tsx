"use client";

import { impactType } from "@/types";
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
import { useEffect, useRef } from "react";
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

function ChartLinear({ impacts }: { impacts: impactType[] }) {
	const chartRef = useRef<ChartJS<"line"> | null>(null);

	const data = {
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

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
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
	};

	useEffect(() => {
		const handleResize = () => {
			if (chartRef && chartRef.current) {
				chartRef.current.update();
			}
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div className="w-full p-4 bg-gray-800 rounded-lg flex-col justify-center items-center overflow-x-auto relative">
			<h2 className="text-center text-lg font-bold text-white  bg-gradient-to-r from-transparent via-sky-700 to-transparent  py-2">
				Linear Chart
			</h2>
			<div className="w-[1000px] min-w-[1000px] max-w-none h-[250px] sm:h-[300px] lg:h-[400px]">
				<Line ref={chartRef} data={data} options={options} />
			</div>
		</div>
	);
}

export { ChartLinear };
