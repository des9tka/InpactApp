"use client";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ChartBar, ChartLinear, RadioChartNav, UserGuest } from "@/components";

function DashboardPage() {
	const [chart, setChart] = useState<"linear" | "bar">("linear");
	const router = useRouter();

	return (
		<div className="flex flex-col justify-center items-center min-h-screen py-2">
			<UserGuest />
			<RadioChartNav chart={chart} setChart={setChart} />

			<div className="w-[95vw] flex justify-center mt-2">
				{chart == "linear" && <ChartLinear />}
				{chart == "bar" && <ChartBar />}
			</div>

			<button
				type="button"
				className="mt-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex gap-2"
				onClick={() => router.push("/data")}
			>
				Edit data <ChevronRight />
			</button>
		</div>
	);
}

export default DashboardPage;
