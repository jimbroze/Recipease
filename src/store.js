import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/state/authReducers";
import recipeReducer from "./recipe/recipeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipeReducer,
  },
});

export default store;
