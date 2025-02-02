"use client";
import { impactActions, useAppDispatch } from "@/redux";
import { impactType } from "@/types";
import { Dialog, Transition } from "@headlessui/react";
import { Field, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment } from "react";

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

const CreateImpactModal: React.FC<{ projectId: string; isOpen: boolean; onClose: () => void }> = ({
	isOpen,
	onClose,
	projectId
}) => {

	const dispatch = useAppDispatch();

	const initialValues: Partial<impactType> = {
		id: 0,
		title: "",
		description: "",
		impactPercent: 0,
		type: "FEAT",
	};

	const handleSubmit = (values: Partial<impactType>) => {
		values.project_id = parseInt(projectId, 10);
		dispatch(impactActions.createImpact(values));
		onClose();
	};

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={onClose}>
				<div className="fixed inset-0 bg-black bg-opacity-50" />
				<div className="fixed inset-0 flex items-center justify-center">
					<Dialog.Panel className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-lg">
						<Dialog.Title className="text-lg font-semibold">
							Create New Impact
						</Dialog.Title>

						<Formik initialValues={initialValues} onSubmit={handleSubmit}>
							{({ values, handleChange, handleBlur, handleSubmit }) => (
								<form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
											value={values.title}
											onChange={handleChange}
											onBlur={handleBlur}
											className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
										/>
									</div>

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
											value={values.description}
											onChange={handleChange}
											onBlur={handleBlur}
											className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none min-h-[150px] max-h-[300px] overflow-auto"
										/>
									</div>

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
									</div>

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
