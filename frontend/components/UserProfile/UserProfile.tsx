"use client";
import { useAppDispatch, useAppSelector, userActions } from "@/redux";
import { useFormik } from "formik";
import { DoorOpenIcon, PenIcon, SaveIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { cookieService } from "@/services/cookieService";
import { userUpdateBodyType } from "@/types";
import { userUpdateValidator } from "@/validators";
import { Notification, UserGuestIcon } from "../UI";

function UserProfile() {
	const [isOpen, setIsOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [showNotification, setShowNotification] = useState(false);
	const pathname = usePathname();

	const {
		user,
		errors: sliceErrors,
		loading,
	} = useAppSelector(state => state.userReducer);
	const dispatch = useAppDispatch();

	// Setup formik for user profile form
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
			// Only update user data if there are changes
			if (
				user?.username !== data.username ||
				user?.name !== data.name ||
				user?.surname !== data.surname
			) {
				dispatch(userActions.updateUserData(data));
			}
		},
	});

	// Sync form fields with user data if user info is available
	useEffect(() => {
		if (user) {
			setFieldValue("username", user.username || "");
			setFieldValue("name", user.name || "");
			setFieldValue("surname", user.surname || "");
		}
	}, [user, setFieldValue]);

	// Toggle edit mode and handle form submission
	const handleEditToggle = (e: React.MouseEvent) => {
		e.preventDefault();
		if (isEdit) {
			handleSubmit();
		} else {
			setIsEdit(true);
		}
	};

	// Cancel the edits and reset the form fields
	const handleCancelEdit = () => {
		setIsEdit(false);
		setFieldValue("username", user?.username || "");
		setFieldValue("name", user?.name || "");
		setFieldValue("surname", user?.surname || "");
	};

	return (
		<div
			className={`absolute top-4 right-4 z-30 ${
				pathname === "/dashboard" || pathname === "/data" ? "block" : "hidden"
			}`}
		>
			<div className="relative">
				<UserGuestIcon onClick={() => setIsOpen(!isOpen)} />
				{showNotification && (
					<Notification
						message="Profile updated successfully!"
						type="success"
						duration={3}
						isVisible={showNotification}
						setIsVisible={setShowNotification}
					/>
				)}
				<div
					className={`${
						isOpen ? "block" : "hidden"
					} absolute top-14 right-4 px-4 py-2 w-[300px] h-[auto] bg-gray-800 rounded-lg shadow-lg opacity-90`}
				>
					<h2 className="font-bold text-xl text-center my-2 text-white">
						Profile
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Username Input */}
						<div className="space-y-2">
							<input
								type="text"
								id="username"
								value={values.username || ""}
								onChange={handleChange}
								onBlur={handleBlur}
								disabled={!isEdit}
								className="w-full px-3 py-2 border rounded-md bg-gray-700 disabled:bg-gray-500"
								placeholder="Your Username"
							/>
							{touched.username && errors.username && (
								<div className="text-red-500 text-sm">{errors.username}</div>
							)}
						</div>

						{/* Name Input */}
						<div className="space-y-2">
							<input
								type="text"
								id="name"
								value={values.name || ""}
								onChange={handleChange}
								onBlur={handleBlur}
								disabled={!isEdit}
								className="w-full px-3 py-2 border rounded-md bg-gray-700 disabled:bg-gray-500"
								placeholder="Your Name"
							/>
							{touched.name && errors.name && (
								<div className="text-red-500 text-sm">{errors.name}</div>
							)}
						</div>

						{/* Surname Input */}
						<div className="space-y-2">
							<input
								type="text"
								id="surname"
								value={values.surname || ""}
								onChange={handleChange}
								onBlur={handleBlur}
								disabled={!isEdit}
								className="w-full px-3 py-2 border rounded-md bg-gray-700 disabled:bg-gray-500"
								placeholder="Your Surname"
							/>
							{touched.surname && errors.surname && (
								<div className="text-red-500 text-sm">{errors.surname}</div>
							)}
						</div>

						{/* Display slice errors */}
						{sliceErrors && (
							<div className="text-red-500 text-sm text-center">
								{sliceErrors}
							</div>
						)}

						{/* Action buttons */}
						<div className="flex justify-evenly">
							<button
								type="button"
								onClick={handleEditToggle}
								className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 disabled:cursor-progress"
								disabled={loading}
							>
								{isEdit ? (
									<span className="flex gap-x-2 items-center py-[2px]">
										Save <SaveIcon />
									</span>
								) : (
									<span className="flex gap-x-2 items-center py-[2px]">
										Edit <PenIcon size={16} />
									</span>
								)}
							</button>

							{isEdit ? (
								<button
									type="button"
									onClick={handleCancelEdit}
									className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
									disabled={loading}
								>
									Cancel
								</button>
							) : (
								<button
									type="button"
									onClick={() => {
										cookieService.deleteCookieAccessRefreshTokens();
										window.location.href = "/login";
										setIsOpen(false);
									}}
									className="px-4 bg-red-500 text-white rounded-md flex gap-x-2 hover:bg-red-700 items-center"
									disabled={loading}
								>
									Exit <DoorOpenIcon />
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
