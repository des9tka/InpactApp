import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
	init: string;
}

const initialState: IInitialState = {
	init: "init",
};

// const init = createAsyncThunk<
// 	{ _: string; noteImgUrl: string },
// 	FormData
// >("init/init", async (formData, { rejectWithValue }) => {
// 	try {
// 		const { data } = await init.init(formData);
// 		const init = formData.get("init") as string;
// 		return init;
// 	} catch (err) {
// 		const typedError = err as AxiosError;
// 		return rejectWithValue(typedError.response?.data);
// 	}
// });

const noteSlice = createSlice({
	name: "noteSlice",
	initialState,
	reducers: {},
	extraReducers: builder => builder,
	// init
	// .addCase(init.pending, state => {
	// 	state.loading = true;
	// 	state.errors = false;
	// })
	// .addCase(init.fulfilled, (state, action) => {
	// 	state.loading = false;
	// 	state.notes = action.payload;
	// })
	// .addCase(init.rejected, state => {
	// 	state.loading = false;
	// 	state.errors = true;
	// })
});

const {
	reducer: userReducer,
	actions: { },
} = noteSlice;

const userActions = {
	
};

export { userActions, userReducer };
