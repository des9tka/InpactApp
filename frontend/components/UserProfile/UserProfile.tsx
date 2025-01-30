"use client";
import { useFormik } from "formik";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector, userActions } from "@/redux";
import { userUpdateBodyType } from "@/types";
import { userUpdateValidator } from "@/validators";
import { Notification, UserGuestIcon } from "../UI";

function UserProfile() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [mounted, setMounted] = useState<boolean>(false);

	const {
		user,
		loading,
		errors: sliceErrors,
	} = useAppSelector(state => state.userReducer);
	const dispatch = useAppDispatch();

	const [showNotification, setShowNotification] = useState<boolean>(false);

	useEffect(() => {
		console.log("profile");
		if (user && !loading && !sliceErrors && isOpen) {
			setShowNotification(true);
		}
	}, [user]);

	const {
		values,
		setFieldValue,
		handleBlur,
		errors,
		touched,
		handleChange,
		handleSubmit,
	} = useFormik({
		initialValues: {
			username: user?.username || "",
			name: user?.name || "",
			surname: user?.surname || "",
		},
		validationSchema: userUpdateValidator,
		onSubmit: (data: userUpdateBodyType) => {
			dispatch(userActions.updateUserData(data));
		},
	});

	const handleEditToggle = (e: React.MouseEvent) => {
		e.preventDefault();
		if (isEdit) {
			handleSubmit();
		} else {
			setIsEdit(true);
		}
	};

	const handleCancelEdit = () => {
		setIsEdit(false);
		setFieldValue("username", user?.username || "");
		setFieldValue("name", user?.name || "");
		setFieldValue("surname", user?.surname || "");
	};

	return (
		<div className="absolute top-4 right-4 z-30">
			{showNotification && (
				<Notification
					message="Profile updated successfully!"
					type="success"
					duration={3}
					isVisible={showNotification}
					setIsVisible={setShowNotification}
				/>
			)}

			<div className="relative">
				<UserGuestIcon onClick={() => setIsOpen(!isOpen)} />
				<div
					className={`${
						isOpen ? "block" : "hidden"
					} absolute top-14 right-4 px-4 py-2 w-[300px] h-[auto] bg-gray-800 rounded-lg shadow-lg opacity-90`}
				>
					<h2 className="font-bold text-xl text-center my-2 text-white">
						Profile
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<input
								type="text"
								id="username"
								value={values.username || ""}
								onChange={handleChange}
								onBlur={handleBlur}
								disabled={!isEdit}
								className="w-full px-3 py-2 border rounded-md bg-gray-500 disabled:bg-gray-700"
								placeholder="Your Username"
							/>
							{touched.username && errors.username && (
								<div className="text-red-500 text-sm">{errors.username}</div>
							)}
						</div>

						<div className="space-y-2">
							<input
								type="text"
								id="name"
								value={values.name || ""}
								onChange={handleChange}
								onBlur={handleBlur}
								disabled={!isEdit}
								className="w-full px-3 py-2 border rounded-md bg-gray-500 disabled:bg-gray-700"
								placeholder="Your Name"
							/>
							{touched.name && errors.name && (
								<div className="text-red-500 text-sm">{errors.name}</div>
							)}
						</div>

						<div className="space-y-2">
							<input
								type="text"
								id="surname"
								value={values.surname || ""}
								onChange={handleChange}
								onBlur={handleBlur}
								disabled={!isEdit}
								className="w-full px-3 py-2 border rounded-md bg-gray-500 disabled:bg-gray-700"
								placeholder="Your Surname"
							/>
							{touched.surname && errors.surname && (
								<div className="text-red-500 text-sm">{errors.surname}</div>
							)}
						</div>

						<div className="flex justify-evenly">
							<button
								type="button"
								onClick={handleEditToggle}
								className="px-4 py-2 bg-blue-600 text-white rounded-md"
							>
								{isEdit ? "Save" : "Edit"}
							</button>
							{isEdit && (
								<button
									type="button"
									onClick={handleCancelEdit}
									className="px-4 py-2 bg-gray-500 text-white rounded-md"
								>
									Cancel
								</button>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export { UserProfile };
