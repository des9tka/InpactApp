"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Loader } from "@/components";
import { cookieService } from "@/services/cookieService";
import { useAppDispatch, useAppSelector } from "./appDispatchHook";
import { userActions } from "./slices";
import path from "path"

const StoreSetupProvider = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useAppDispatch();
	const { user } = useAppSelector(state => state.userReducer);
	const [mounted, setMounted] = useState(false);
	const router = useRouter();

	const pathname = usePathname()

	useEffect(() => {
		if (
			!user &&
			(pathname == "/dashboard" ||
				pathname == "/data")
		) {
			dispatch(userActions.setUpUserInfo())
				.then(() => setMounted(true))
				.catch(e => {
					cookieService.deleteCookieAccessRefreshTokens();
					router.push("/login?expired=true");
				});
		} else setMounted(true);
	}, [pathname]);

	if (!mounted)
		return (
			<div className="w-full h-full justify-center flex items-center">
				<Loader />
			</div>
		);
	else return <div>{mounted && children}</div>;
};

export { StoreSetupProvider };
