"use client";

import React from "react";
import { Provider } from "react-redux";
import { setupStore } from "./store";

// StoreProvider component: Wraps the application with Redux provider for state management.
const StoreProvider = ({ children }: { children: React.ReactNode }) => {
	// Initialize the Redux store
	const store = setupStore();

	// Return the Provider component that makes the store available to the rest of the app
	return <Provider store={store}>{children}</Provider>;
};

export { StoreProvider };
