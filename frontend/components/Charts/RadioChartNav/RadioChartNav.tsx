import React from "react";

function RadioChartNav({
	chart,
	setChart,
}: {
	chart: string;
	setChart: Function;
}) {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChart(event.target.value);
	};

	return (
		<div className="relative max-w-sm flex w-full flex-col rounded-xl bg-gray-700 shadow">
			<nav className="flex min-w-[240px] flex-row gap-1 p-2">
				{/* Linear Option */}
				<div
					role="button"
					className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
				>
					<label
						htmlFor="react-horizontal"
						className="flex w-full cursor-pointer items-center px-3 py-2"
					>
						<div className="inline-flex items-center">
							<input
								name="framework-horizontal"
								type="radio"
								id="react-horizontal"
								value="linear"
								checked={chart === "linear"}
								onChange={handleChange}
								className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
							/>
							<span className="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
							<label
								className="ml-2 text-white cursor-pointer text-sm"
								htmlFor="react-horizontal"
							>
								Linear
							</label>
						</div>
					</label>
				</div>

				{/* Bar Option */}
				<div
					role="button"
					className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
				>
					<label
						htmlFor="vue-horizontal"
						className="flex w-full cursor-pointer items-center px-3 py-2"
					>
						<div className="inline-flex items-center">
							<input
								name="framework-horizontal"
								type="radio"
								id="vue-horizontal"
								value="bar"
								checked={chart === "bar"}
								onChange={handleChange}
								className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
							/>
							<span className="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
							<label
								className="ml-2 text-white cursor-pointer text-sm"
								htmlFor="vue-horizontal"
							>
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
