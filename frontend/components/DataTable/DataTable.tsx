import React, { useState } from "react";
import { Column, useTable } from "react-table";

interface RowData {
	id: number;
	title: string;
	description: string;
	type: string;
	impactPercent: number;
	created_at: string;
}

interface DataTableProps {
	data: RowData[];
	onSave: (updatedData: RowData[]) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onSave }) => {
	const [editingRow, setEditingRow] = useState<number | null>(null);
	const [editedData, setEditedData] = useState<RowData | null>(null);
	const [loading, setLoading] = useState(false);

	const columns: Column<RowData>[] = React.useMemo(
		() => [
			{
				Header: "Title",
				accessor: "title",
			},
			{
				Header: "Description",
				accessor: "description",
			},
			{
				Header: "Type",
				accessor: "type",
				Cell: ({ value }) => (
					<span
						className={`px-2 py-1 rounded text-xs font-medium
            ${value === "FEAT" ? "bg-blue-100 text-blue-800" : ""}
            ${value === "WIP" ? "bg-yellow-100 text-yellow-800" : ""}
            ${value === "FIX" ? "bg-red-100 text-red-800" : ""}
          `}
					>
						{value}
					</span>
				),
			},
			{
				Header: "Impact Percent",
				accessor: "impactPercent",
				Cell: ({ value }) => (
					<div className="flex items-center">
						<div className="w-full bg-gray-200 rounded h-2">
							<div
								className="bg-blue-600 rounded h-2"
								style={{ width: `${value}%` }}
							/>
						</div>
						<span className="ml-2">{value}%</span>
					</div>
				),
			},
			{
				Header: "Created At",
				accessor: "created_at",
				Cell: ({ value }) => new Date(value).toLocaleDateString(),
			},
			{
				Header: "Actions",
				id: "actions",
				Cell: ({ row }) => (
					<button
						onClick={() => handleEditClick(row.index)}
						className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
						disabled={loading || editingRow !== null}
					>
						Edit
					</button>
				),
			},
		],
		[editingRow, loading]
	);

	const handleEditClick = (index: number): void => {
		setEditingRow(index);
		setEditedData({ ...data[index] });
	};

	const handleSave = async (): Promise<void> => {
		if (editingRow !== null && editedData) {
			setLoading(true);
			try {
				const updatedData = [...data];
				updatedData[editingRow] = editedData;
				await onSave(updatedData);
				setEditingRow(null);
				setEditedData(null);
			} catch (error) {
				console.error("Error saving:", error);
			} finally {
				setLoading(false);
			}
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		field: keyof RowData
	): void => {
		if (editedData) {
			const value =
				field === "impactPercent" ? parseFloat(e.target.value) : e.target.value;

			setEditedData({ ...editedData, [field]: value });
		}
	};

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable({
			columns,
			data,
		});

	return (
		<div className="overflow-x-auto rounded-lg border border-gray-200">
			<table {...getTableProps()} className="w-full border-collapse">
				<thead className="bg-gray-100">
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th
									{...column.getHeaderProps()}
									className="p-4 text-left text-sm font-medium text-gray-700"
								>
									{column.render("Header")}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
					{rows.map((row, rowIndex) => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()} className="bg-white hover:bg-gray-50">
								{row.cells.map(cell => {
									if (cell.column.id === "actions") {
										return (
											<td {...cell.getCellProps()} className="p-4">
												{editingRow === rowIndex ? (
													<div className="space-x-2">
														<button
															onClick={handleSave}
															disabled={loading}
															className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
														>
															{loading ? "Saving..." : "Save"}
														</button>
														<button
															onClick={() => {
																setEditingRow(null);
																setEditedData(null);
															}}
															disabled={loading}
															className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
														>
															Cancel
														</button>
													</div>
												) : (
													cell.render("Cell")
												)}
											</td>
										);
									}

									return (
										<td
											{...cell.getCellProps()}
											className="p-4 text-sm text-gray-900"
										>
											{editingRow === rowIndex ? (
												<input
													type={
														cell.column.id === "impactPercent"
															? "number"
															: "text"
													}
													className="w-full p-2 border rounded text-gray-900"
													value={
														editedData
															? String(
																	editedData[cell.column.id as keyof RowData]
															  )
															: ""
													}
													onChange={e =>
														handleChange(e, cell.column.id as keyof RowData)
													}
													disabled={loading}
												/>
											) : (
												cell.render("Cell")
											)}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export { DataTable };
