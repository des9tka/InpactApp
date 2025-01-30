"use client";
import React, { useEffect, useState } from "react";

import { Loader } from "@/components";
import { useAppDispatch, useAppSelector } from "./appDispatchHook";
import { userActions } from "./slices";

const StoreSetupProvider = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useAppDispatch();
	const { user, loading } = useAppSelector(state => state.userReducer);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		if (!user && !mounted && window.location.pathname !== "/login") {
			dispatch(userActions.setUpUserInfo());
		} else setMounted(true);
	}, []);

	if (loading && !mounted)
		return (
			<div className="w-full h-full justify-center flex items-center">
				<Loader />
			</div>
		);
	else return <div>{user && children}</div>;
};

export { StoreSetupProvider };
