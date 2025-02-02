import { useFormik } from "formik";
import { motion } from "framer-motion";

import { projectActions, useAppDispatch } from "@/redux";
import { createProjectType } from "@/types";
import { projectValidationSchema } from "@/validators";

function ProjectCreateForm({
	setCreateProject,
}: {
	setCreateProject: Function;
}) {
	const dispatch = useAppDispatch();

	const formik = useFormik({
		initialValues: {
			name: "",
		},
		validationSchema: projectValidationSchema,
		onSubmit: (data: createProjectType) => {
			dispatch(projectActions.createProject(data));
		},
	});

	return (
		<div>
			<div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
				<motion.div
					className="div"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					transition={{ duration: 0.3 }}
				>
					<div className="bg-gray-700 px-6 py-4 rounded-lg w-96 shadow-lg">
						<h2 className="text-center text-2xl font-bold tracking-tight text-sky-500 mb-8">
							Create project
						</h2>

						<form onSubmit={formik.handleSubmit} className="space-y-4">
							<div>
								<div className="flex justify-between mb-1">
									<label className="block text-sm font-medium text-gray-300">
										Project Name
									</label>
								</div>
								<input
									type="email"
									name="email"
									value={formik.values.name}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-sky-600"
								/>
								{formik.touched.name && formik.errors.name && (
									<p className="text-red-500 text-xs mt-1 text-center">
										{formik.errors.name}
									</p>
								)}
								<div className="flex justify-evenly gap-2">
									<button
										type="submit"
										className="mt-4 w-full rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
									>
										Create Project
									</button>
									<button
										className="mt-4 w-full rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
										onClick={() => {
											dispatch(projectActions.setError(null));
											setCreateProject(false);
										}}
									>
										Cancel
									</button>
								</div>
							</div>
						</form>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export { ProjectCreateForm };
