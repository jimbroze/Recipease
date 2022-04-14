import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/state/authReducers";
import recipesReducer from "./recipe/recipesSlice";
import currentRecipeReducer from "./recipe/currentRecipeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipesReducer,
    currentRecipe: currentRecipeReducer,
  },
});

export default store;
