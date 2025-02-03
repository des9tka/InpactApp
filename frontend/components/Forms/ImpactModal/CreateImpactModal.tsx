"use client";
import { Dialog, Transition } from "@headlessui/react";
import { ErrorMessage, Field, Formik } from "formik";
import React, { Fragment } from "react";

import { impactActions, useAppDispatch } from "@/redux";
import { impactType } from "@/types";
import { impactValidationSchema } from "@/validators";

// A mapping of different types to their respective color codes
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

// InputField component to handle generic input fields with validation
const InputField: React.FC<{
	id: string;
	label: string;
	value: string;
	onChange: React.ChangeEventHandler;
	onBlur: React.FocusEventHandler;
}> = ({ id, label, value, onChange, onBlur }) => (
	<div className="space-y-2">
		<label htmlFor={id} className="block text-sm font-semibold">
			{label}
		</label>
		<Field
			id={id}
			name={id}
			value={value || ""} // Fallback to empty string if value is undefined
			onChange={onChange}
			onBlur={onBlur}
			className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
		/>
	</div>
);

// SelectField component to handle select dropdown fields
const SelectField: React.FC<{
	id: string;
	label: string;
	value: string;
	onChange: React.ChangeEventHandler;
	onBlur: React.FocusEventHandler;
}> = ({ id, label, value, onChange, onBlur }) => (
	<div className="space-y-2">
		<label htmlFor={id} className="block text-sm font-semibold">
			{label}
		</label>
		<Field
			id={id}
			as="select"
			name={id}
			value={value || ""} // Fallback to empty string if value is undefined
			onChange={onChange}
			onBlur={onBlur}
			className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
		>
			{Object.keys(typeColors).map(type => (
				<option key={type} value={type}>
					{type}
				</option>
			))}
		</Field>
	</div>
);

// Main modal component for creating a new impact
const CreateImpactModal: React.FC<{
	projectId: string;
	isOpen: boolean;
	onClose: () => void;
}> = ({ isOpen, onClose, projectId }) => {
	const dispatch = useAppDispatch();

	// Initial form values, where projectId will be added later
	const initialValues: Partial<impactType> = {
		id: 0,
		title: "",
		description: "",
		impactPercent: 0,
		type: "FEAT",
	};

	// Handle form submission: add the projectId and dispatch the createImpact action
	const handleSubmit = (values: Partial<impactType>) => {
		values.project_id = parseInt(projectId, 10); // Ensure projectId is a number
		dispatch(impactActions.createImpact(values)); // Dispatch action to create impact
		onClose(); // Close the modal after submission
	};

	return (
		// Transition component for smooth modal visibility
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={onClose}>
				<div className="fixed inset-0 bg-black bg-opacity-50" />
				<div className="fixed inset-0 flex items-center justify-center">
					<Dialog.Panel className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-lg">
						<Dialog.Title className="text-lg font-semibold">
							Create New Impact
						</Dialog.Title>

						{/* Formik to handle the form submission and validation */}
						<Formik
							initialValues={initialValues}
							onSubmit={handleSubmit}
							validationSchema={impactValidationSchema}
						>
							{({ values, handleChange, handleBlur, handleSubmit }) => (
								<form onSubmit={handleSubmit}>
									{/* // Title input field with error display */}
									<div className="space-y-2">
										<label
											htmlFor="title"
											className="block text-sm font-semibold"
										>
											Title
										</label>
										<Field
											id="title"
											name="title"
											value={values.title || ""}
											onChange={handleChange}
											onBlur={handleBlur}
											className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
										/>
										{/* Error message for Title */}
										<div className="flex justify-center">
											<ErrorMessage
												name="title"
												component="div"
												className="text-sm text-red-500 mt-1"
											/>
										</div>
									</div>
									{/* // Description input field with error display */}
									<div className="space-y-2">
										<label
											htmlFor="description"
											className="block text-sm font-semibold"
										>
											Description
										</label>
										<Field
											id="description"
											as="textarea"
											name="description"
											value={values.description || ""}
											onChange={handleChange}
											onBlur={handleBlur}
											className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none min-h-[150px] max-h-[300px] overflow-auto"
										/>
										{/* Error message for Description */}
										<div className="flex justify-center">
											<ErrorMessage
												name="description"
												component="div"
												className="text-sm text-red-500 mt-1"
											/>
										</div>
									</div>
									{/* // Type selection dropdown with error display */}
									<div className="space-y-2">
										<label
											htmlFor="type"
											className="block text-sm font-semibold"
										>
											Type
										</label>
										<Field
											id="type"
											as="select"
											name="type"
											value={values.type || ""}
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
										{/* Error message for Type */}
										<div className="flex justify-center">
											<ErrorMessage
												name="type"
												component="div"
												className="text-sm text-red-500 mt-1"
											/>
										</div>
									</div>
									{/* Action buttons: Cancel and Submit */}
									<div className="mt-4 flex justify-end space-x-4">
										<button
											type="button"
											onClick={onClose}
											className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
										>
											Cancel
										</button>
										<button
											type="submit"
											className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
										>
											Create Impact
										</button>
									</div>
								</form>
							)}
						</Formik>
					</Dialog.Panel>
				</div>
			</Dialog>
		</Transition>
	);
};

export default CreateImpactModal;
