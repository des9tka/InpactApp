import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { userReducer, projectReducer } from "./slices";

const rootReducer = combineReducers({
	userReducer,
	projectReducer
});

const setupStore = () =>
	configureStore({
		reducer: rootReducer,
	});

type RootState = ReturnType<typeof rootReducer>;
type AppStore = ReturnType<typeof setupStore>;
type AppDispatch = AppStore["dispatch"];

export type { AppDispatch, AppStore, RootState };

export { setupStore };
