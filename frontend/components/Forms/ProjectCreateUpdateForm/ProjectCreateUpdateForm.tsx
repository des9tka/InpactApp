"use client";
import { FormikHelpers, useFormik } from "formik";
import { motion } from "framer-motion";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

import { projectActions, useAppDispatch, useAppSelector } from "@/redux";
import { createProjectType, projectType, updateProjectType } from "@/types";
import { projectValidationSchema } from "@/validators";

function ProjectCreateUpdateForm({
	create,
	setOpenCreateUpdateProject,
	project,
	setPNumber,
}: {
	create: boolean;
	setOpenCreateUpdateProject: (open: boolean) => void;
	project?: projectType;
	setPNumber: Function;
}) {
	const dispatch = useAppDispatch();
	const { errors } = useAppSelector(state => state.projectReducer);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deleteInput, setDeleteInput] = useState("");

	// Initial form values, use existing project name if available
	const initialValues: createProjectType = {
		name: project?.name || "",
	};

	const formik = useFormik<createProjectType>({
		initialValues,
		validationSchema: projectValidationSchema, // Apply validation schema
		onSubmit: (data, { setSubmitting }: FormikHelpers<createProjectType>) => {
			// Dispatch action based on whether we are creating or updating the project
			if (create) {
				dispatch(projectActions.createProject(data));
			} else if (project) {
				const updatedProject: updateProjectType = {
					...data,
					id: project.id, // Update project with existing ID
				};
				dispatch(projectActions.updateProject(updatedProject));
			}
			setSubmitting(false); // Set submitting state to false
			setOpenCreateUpdateProject(false); // Close the form modal after submission
		},
	});

	// Handle project deletion after user confirms
	const handleDelete = () => {
		if (project && deleteInput === project.name) {
			dispatch(projectActions.deleteProject(project.id)).then(() => {
				setPNumber(0); // Reset the current project number
				setOpenCreateUpdateProject(false); // Close the modal after deletion
			});
		}
	};

	return (
		<div className="z-30 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
			<motion.div
				className="div"
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				transition={{ duration: 0.3 }}
			>
				<div className="bg-gray-700 px-6 py-4 rounded-lg w-96 shadow-lg">
					<h2 className="text-center text-2xl font-bold tracking-tight text-sky-500 mb-8">
						{create ? "Create Project" : "Update Project"}{" "}
						{/* Dynamic heading based on create flag */}
					</h2>

					<form onSubmit={formik.handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-300">
								Project Name
							</label>
							<div className="flex items-center gap-2">
								<input
									type="text"
									name="name"
									value={formik.values.name}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-sky-600"
								/>
								{!create && (
									<button
										type="button"
										onClick={() => setShowDeleteModal(true)} // Trigger the delete modal
										className="text-red-500 hover:text-red-700"
									>
										<Trash2Icon size={20} />
									</button>
								)}
							</div>
							{formik.touched.name && formik.errors.name && (
								<p className="text-red-500 text-xs mt-1 text-center">
									{formik.errors.name} {/* Display validation error for name */}
								</p>
							)}
							{errors && (
								<p className="text-red-500 text-xs mt-1 text-center">
									{errors} {/* Display global errors if any */}
								</p>
							)}
						</div>

						<div className="flex justify-evenly gap-2">
							<button
								type="submit"
								className="w-full rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-500"
							>
								{create ? "Create Project" : "Update Project"}{" "}
								{/* Submit button text */}
							</button>
							<button
								className="w-full rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-500"
								onClick={() => setOpenCreateUpdateProject(false)} // Close modal on cancel
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</motion.div>

			{showDeleteModal && (
				<div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
					<div className="bg-gray-800 p-6 rounded-md">
						<p className="text-white mb-4">
							Type "{project?.name}" to confirm deletion:
						</p>
						<input
							type="text"
							value={deleteInput}
							onChange={e => setDeleteInput(e.target.value)} // Bind delete input value
							className="w-full p-2 rounded-md text-black"
						/>
						<div className="flex justify-evenly mt-4">
							<button
								onClick={handleDelete} // Trigger deletion
								className="bg-red-600 px-4 py-2 w-[45%] rounded-md text-white"
								disabled={deleteInput !== project?.name} // Disable button until input matches project name
							>
								Delete
							</button>
							<button
								onClick={() => setShowDeleteModal(false)} // Close modal without deletion
								className="bg-gray-600 px-4 py-2 rounded-md text-white w-[45%] "
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export { ProjectCreateUpdateForm };
