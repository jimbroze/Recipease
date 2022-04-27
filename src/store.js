import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./api/apiSlice";
import authReducer from "./auth/state/authReducers";
import currentRecipeReducer from "./recipe/currentRecipeSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    currentRecipe: currentRecipeReducer,
  },
  middleware: (gDM) => gDM().concat(apiSlice.middleware),
});

export default store;
