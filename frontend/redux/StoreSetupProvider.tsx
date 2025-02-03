"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Loader } from "@/components";
import { useAppDispatch, useAppSelector } from "./appDispatchHook";
import { userActions } from "./slices";

const StoreSetupProvider = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useAppDispatch();
	const { user } = useAppSelector(state => state.userReducer);
	const [mounted, setMounted] = useState(false);
	const router = useRouter();
	const pathname = usePathname(); // Current pathname to check which page is being accessed

	useEffect(() => {
		// If the user is not logged in and is trying to access restricted pages, set up user info
		if (!user && (pathname === "/dashboard" || pathname === "/data")) {
			dispatch(userActions.setUpUserInfo()).then(() => setMounted(true));
		} else {
			// If user exists or no restricted page is being accessed, just mount the component
			setMounted(true);
		}
	}, [pathname, user, dispatch, router]);

	// Show a loader until the component is mounted
	if (!mounted) {
		return (
			<div className="w-full h-full justify-center flex items-center">
				<Loader />
			</div>
		);
	}

	// Render children once the component is mounted
	return <div>{children}</div>;
};

export { StoreSetupProvider };
