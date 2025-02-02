"use client";
import { ChevronLeft, PlusIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import ImpactTable from "@/components/DataTable/ImpactTable";
import { impactActions, useAppDispatch, useAppSelector } from "@/redux";
import { useEffect } from "react";

function DataPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const project_id = searchParams.get("project");
	const { impacts } = useAppSelector(state => state.impactReducer);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!project_id) {
			router.push("/dashboard");
		} else if (!impacts.length) {
			dispatch(impactActions.getUserProjectImpacts(parseInt(project_id)));
		}
	}, []);

	return (
		<div className="p-4 flex flex-col items-center justify-center w-full mt-12">
			<h1 className="text-3xl font-bold mb-4">Data Table</h1>
			<button className="my-2 flex gap-2 items-center bg-sky-700 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded">
				Create Impact <PlusIcon size={16} />
			</button>
			<ImpactTable impacts={impacts} />
			<button
				type="button"
				className="mt-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex gap-2 w-[150px]"
				onClick={() => router.push("/dashboard")}
			>
				<ChevronLeft /> See Charts
			</button>
		</div>
	);
}

export default DataPage;
