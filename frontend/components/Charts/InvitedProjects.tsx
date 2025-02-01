"use client";
import { ChevronRight, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ChartBar, ChartLinear, RadioChartNav } from "@/components";
import { projectType } from "@/types";

function InvitedProjects({ projects }: { projects: projectType[] }) {
	const [chart, setChart] = useState<"linear" | "bar">("linear");
	const router = useRouter();
	const [mounted, setMounted] = useState<boolean>(false);

	return (
		<div className="flex flex-col justify-center items-center min-h-screen py-2">
			<h2 className="flex text-3xl justify-center items-center font-bold gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 w-[35vw] text-center rounded-xl py-4 mb-2">
				Invited Projects <UsersIcon size={28} />
			</h2>

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

export { InvitedProjects };
