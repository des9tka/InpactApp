import React from "react";

function RadioChartNav({
	chart,
	setChart,
}: {
	chart: string;
	setChart: Function;
}) {
	// Handle radio button change
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChart(event.target.value); // Update the chart type based on selected radio
	};

	return (
		<div className="relative max-w-sm flex w-full flex-col rounded-xl bg-gray-700 shadow">
			<nav className="flex min-w-[240px] flex-row gap-1 p-2">
				{/* Linear chart radio button */}
				<div
					role="button"
					className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-500"
				>
					<label className="flex w-full cursor-pointer items-center px-3 py-2">
						<div className="inline-flex items-center justify-center w-full">
							<input
								type="radio"
								value="linear"
								checked={chart === "linear"}
								onChange={handleChange}
								className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all checked:bg-sky-500"
							/>
							<label className="ml-2 text-white cursor-pointer text-sm">
								Linear
							</label>
						</div>
					</label>
				</div>

				{/* Bar chart radio button */}
				<div
					role="button"
					className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-500"
				>
					<label className="flex w-full cursor-pointer items-center px-3 py-2">
						<div className="inline-flex items-center justify-center w-full">
							<input
								type="radio"
								value="bar"
								checked={chart === "bar"}
								onChange={handleChange}
								className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all checked:bg-sky-500"
							/>
							<label className="ml-2 text-white cursor-pointer text-sm">
								Bar
							</label>
						</div>
					</label>
				</div>
			</nav>
		</div>
	);
}

export { RadioChartNav };
