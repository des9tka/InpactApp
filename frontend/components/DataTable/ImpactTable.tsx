"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Field, Formik } from "formik";
import React, { Fragment, useEffect, useState } from "react";

import { impactActions, useAppDispatch } from "@/redux";
import { impactType, userType } from "@/types";

// Colors for different impact types
const typeColors: Record<string, string> = {
	FEAT: "bg-green-500",
	FIX: "bg-red-500",
	REF: "bg-yellow-500",
	DOCS: "bg-blue-500",
	STYLE: "bg-purple-500",
	PERF: "bg-indigo-500",
	TEST: "bg-teal-500",
	REVERT: "bg-orange-500",
	WIP: "bg-pink-500",
	BUILD: "bg-gray-500",
	MERGE: "bg-cyan-500",
};

const EditableImpactRow: React.FC<{
	impact: impactType;
	user: userType | null;
	isEditing: boolean;
	onEdit: () => void;
	onCancel: () => void;
	onSave: (values: impactType) => void;
}> = ({ impact, isEditing, onEdit, onCancel, onSave, user }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<Formik initialValues={impact} onSubmit={onSave} enableReinitialize>
			{({ values, handleChange, handleBlur, handleSubmit }) => (
				<tr className="border-b border-gray-700 hover:bg-gray-800">
					{/* Title */}
					<td className="py-3 px-4">
						{isEditing ? (
							<Field
								name="title"
								value={values.title}
								onChange={handleChange}
								onBlur={handleBlur}
								className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
							/>
						) : (
							impact.title
						)}
					</td>

					{/* Description */}
					<td className="py-3 px-4 relative">
						{isEditing ? (
							<Field
								as="textarea"
								name="description"
								value={values.description}
								onChange={handleChange}
								onBlur={handleBlur}
								className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none min-h-[150px] max-h-[300px] overflow-auto"
							/>
						) : (
							<div
								className="cursor-pointer text-sky-400 hover:text-sky-300"
								onClick={() => setIsModalOpen(true)}
							>
								{impact.description.length > 25
									? `${impact.description.slice(0, 25)}...`
									: impact.description}
							</div>
						)}
					</td>

					{/* Impact Percent */}
					<td className="py-3 px-4">
						{isEditing ? (
							<Field
								name="impactPercent"
								type="number"
								value={values.impactPercent}
								onChange={handleChange}
								onBlur={handleBlur}
								className="w-24 px-3 py-2 border border-gray-600 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
							/>
						) : (
							<div className="flex items-center space-x-2">
								<span>{impact.impactPercent}%</span>
								<div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
									<div
										className="h-full bg-sky-500 transition-all"
										style={{ width: `${impact.impactPercent}%` }}
									/>
								</div>
							</div>
						)}
					</td>

					{/* Impact Type */}
					<td className="py-3 px-4">
						{isEditing ? (
							<Field
								as="select"
								name="type"
								value={values.type}
								onChange={handleChange}
								onBlur={handleBlur}
								className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
							>
								{Object.keys(typeColors).map(type => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</Field>
						) : (
							<span
								className={`px-3 py-1 text-sm font-medium text-white rounded-md ${
									typeColors[impact.type]
								}`}
							>
								{impact.type}
							</span>
						)}
					</td>

					{/* Created and Updated At */}
					<td className="py-3 px-4 text-center">
						<div>{impact.created_at}</div>
						<div>
							{impact.updated_at ? (
								impact.updated_at
							) : (
								<span className="text-red-500">❌</span> // Red cross if updated_at is null
							)}
						</div>
					</td>

					<td className="py-3 px-4">
						{user && (
							<span className="text-sky-400">
								@
								{user.email.slice(0, 10) +
									(user.email.length > 10 ? "..." : "")}
							</span>
						)}
					</td>

					{/* Actions */}
					<td className="py-3 px-4">
						{isEditing ? (
							<div className="flex flex-col space-y-2">
								<button
									type="submit"
									className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
									onClick={e => {
										e.preventDefault();
										handleSubmit();
									}}
								>
									Save
								</button>
								<button
									type="button"
									onClick={onCancel}
									className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
								>
									Cancel
								</button>
							</div>
						) : (
							<button
								type="button"
								onClick={onEdit}
								className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
							>
								Edit
							</button>
						)}
					</td>

					{/* Modal for full description */}
					<Transition appear show={isModalOpen} as={Fragment}>
						<Dialog
							as="div"
							className="relative z-10"
							onClose={() => setIsModalOpen(false)}
						>
							<div className="fixed inset-0 bg-black bg-opacity-50" />
							<div className="fixed inset-0 flex items-center justify-center">
								<Dialog.Panel className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-lg">
									<Dialog.Title className="text-lg font-semibold">
										Full Description
									</Dialog.Title>
									<Dialog.Description className="mt-2 text-gray-400">
										{impact.description}
									</Dialog.Description>
									<button
										className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
										onClick={() => setIsModalOpen(false)}
									>
										Close
									</button>
								</Dialog.Panel>
							</div>
						</Dialog>
					</Transition>
				</tr>
			)}
		</Formik>
	);
};

const ImpactTable: React.FC<{
	impacts: impactType[];
	projectId: number;
	users: userType[];
}> = ({ impacts, projectId, users }) => {
	const [editableId, setEditableId] = useState<number | null>(null);
	const dispatch = useAppDispatch();

	const handleSave = (values: impactType) => {
		dispatch(impactActions.updateImpact(values));
		setEditableId(null);
	};

	// Fetch impacts if not already available
	useEffect(() => {
		if (!impacts.length) {
			dispatch(impactActions.getUserProjectImpacts(projectId));
		}
	}, [impacts.length, projectId, dispatch]);

	return (
		<div className="overflow-x-auto p-4 rounded-lg">
			<table className="min-w-full border border-gray-500 shadow-lg bg-gray-900 text-gray-300 rounded-xl">
				<thead>
					<tr className="bg-gray-800 text-white">
						{[
							"Title",
							"Description",
							"Impact Percent",
							"Type",
							"Created / Updated",
							"Created By",
							"Actions",
						].map(header => (
							<th
								key={header}
								className="py-3 px-4 text-left text-sm font-semibold uppercase"
							>
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{impacts.map(impact => (
						<EditableImpactRow
							key={impact.id}
							user={users.find(user => user.id === impact.user_id) || null}
							impact={impact}
							isEditing={editableId === impact.id}
							onEdit={() => setEditableId(impact.id)}
							onCancel={() => setEditableId(null)}
							onSave={handleSave}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ImpactTable;
