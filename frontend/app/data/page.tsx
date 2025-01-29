"use client";
import { DataTable } from "@/components";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DataType {
	id: number;
	title: string;
	description: string;
	type: string;
	impactPercent: number;
	created_at: string;
}

const initialData: DataType[] = [
	{
		id: 1,
		title: "Title1",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		type: "FEAT",
		impactPercent: 43.0,
		created_at: "2024-12-01",
	},
	{
		id: 2,
		title: "Title2",
		description:
			"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
		type: "WIP",
		impactPercent: 23.1,
		created_at: "2024-12-01",
	},
	{
		id: 3,
		title: "Title3",
		description:
			"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
		type: "FIX",
		impactPercent: 10.4,
		created_at: "2024-12-01",
	},
];

function DataPage() {
	const [tableData, setTableData] = useState<DataType[]>(initialData);
	const router = useRouter();

	const handleSave = async (updatedRow: DataType, rowIndex: number) => {
		try {
			const newData = [...tableData];
			newData[rowIndex] = updatedRow;
			setTableData(newData);

			console.log("Сохранена строка:", updatedRow);
			console.log("Индекс строки:", rowIndex);
		} catch (error) {
			console.error("Ошибка при сохранении:", error);
		}
	};

	return (
		<div className="p-4 flex flex-col items-center justify-center w-full mt-12">
			<h1 className="text-3xl font-bold mb-4">Data Table</h1>
			<DataTable data={tableData} onSave={handleSave} />
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
