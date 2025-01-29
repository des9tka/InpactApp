"use client";
import { DataTable } from "@/components";
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
		description: "Description1",
		type: "FEAT",
		impactPercent: 43.0,
		created_at: "2024-12-01",
	},
	{
		id: 2,
		title: "Title2",
		description: "Description2",
		type: "WIP",
		impactPercent: 23.1,
		created_at: "2024-12-01",
	},
	{
		id: 3,
		title: "Title3",
		description: "Description3",
		type: "FIX",
		impactPercent: 10.4,
		created_at: "2024-12-01",
	},
];

function DataPage() {
	const [tableData, setTableData] = useState<DataType[]>(initialData);

	const handleSave = async (updatedData: DataType[]) => {
		try {
			// Здесь будет ваш API-запрос
			// const response = await fetch('/api/data', {
			//   method: 'PUT',
			//   headers: {
			//     'Content-Type': 'application/json',
			//   },
			//   body: JSON.stringify(updatedData),
			// });

			// if (!response.ok) {
			//   throw new Error('Failed to save data');
			// }

			// Обновляем локальное состояние после успешного сохранения
			setTableData(updatedData);
			console.log("Данные успешно сохранены:", updatedData);
		} catch (error) {
			console.error("Ошибка при сохранении:", error);
			// Здесь можно добавить уведомление об ошибке
		}
	};

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Данные</h1>
			<DataTable data={tableData} onSave={handleSave} />
		</div>
	);
}

export default DataPage;
