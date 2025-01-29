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

function ChartLinear() {
	const chartRef = useRef<ChartJS<"line"> | null>(null);

	const data = {
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
				fill: true,
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
		<div className="w-full p-4 bg-gray-800 rounded-lg flex-col justify-center items-center">
			<h2 className="text-center text-lg font-bold text-white">Linear Chart</h2>
			<div className="w-full h-full">
				<Line ref={chartRef} data={data} options={options} />
			</div>
		</div>
	);
}

export { ChartLinear };
