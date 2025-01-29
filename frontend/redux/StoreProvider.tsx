"use client";

import React from "react";
import { Provider } from "react-redux";
import { setupStore } from "./store";

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
	const store = setupStore();

	return <Provider store={store}>{children}</Provider>;
};

export { StoreProvider };
