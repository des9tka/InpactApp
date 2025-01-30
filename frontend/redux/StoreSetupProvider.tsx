"use client";
import React, { useEffect, useState } from "react";

import { Loader } from "@/components";
import { cookieService } from "@/services/cookieService";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "./appDispatchHook";
import { userActions } from "./slices";

const StoreSetupProvider = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useAppDispatch();
	const { user, loading } = useAppSelector(state => state.userReducer);
	const [mounted, setMounted] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (!user && window.location.pathname !== "/login") {
			dispatch(userActions.setUpUserInfo())
				.then(() => setMounted(true))
				.catch(e => {
					cookieService.deleteCookieAccessRefreshTokens();
					router.push("/login?expired=true");
				});
		} else setMounted(true);
	}, []);

	if (!mounted)
		return (
			<div className="w-full h-full justify-center flex items-center">
				<Loader />
			</div>
		);
	else return <div>{mounted && children}</div>;
};

export { StoreSetupProvider };
