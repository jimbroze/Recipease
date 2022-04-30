import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./api/apiSlice";
import authReducer from "./auth/state/authReducers";
import currentRecipeReducer from "./recipe/currentRecipeSlice";
import errorReducer from "./error/errorSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    currentRecipe: currentRecipeReducer,
    errors: errorReducer,
  },
  middleware: (gDM) => gDM().concat(apiSlice.middleware),
});

export default store;
