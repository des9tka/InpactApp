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
import { useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend);

const ChartBar = ({ impacts }: { impacts: impactType[] }) => {
	const chartRef = useRef<ChartJS<"bar"> | null>(null);

	const barData = {
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

	const barOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
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
		<div className="w-full p-4 bg-gray-800 rounded-lg flex-col justify-center items-center overflow-x-auto">
			<h2 className="text-center text-lg font-bold text-white  bg-gradient-to-r from-transparent via-sky-700 to-transparent  py-2">Bar Chart</h2>
			<div className="w-[1000px] min-w-[1000px] max-w-none h-[250px] sm:h-[300px] lg:h-[400px]">
				<Bar ref={chartRef} data={barData} options={barOptions} />
			</div>
		</div>
	);
};

export { ChartBar };
