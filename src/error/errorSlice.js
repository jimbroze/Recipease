import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const errorAdapter = createEntityAdapter();

const errorSlice = createSlice({
  name: "errors",
  initialState: errorAdapter.getInitialState(),
  reducers: {
    errorAdded: errorAdapter.addOne,
    errorRemoved: errorAdapter.removeOne,
    errorsCleared: errorAdapter.removeAll,
  },
});

export const { errorAdded, errorRemoved, errorsCleared } = errorSlice.actions;

export default errorSlice.reducer;

export const errorSelectors = errorAdapter.getSelectors(
  (state) => state.errors
);
