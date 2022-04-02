import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import recipease from "../api/recipease";

const initialState = {
  recipes: {},
  updateStatus: "idle",
  error: "",
};

export const createRecipe = createAsyncThunk(
  "recipes/createRecipe",
  async (recipe, { getState }) => {
    // Get userId state with getState and post to API
    const { userId } = getState().auth;
    const response = await recipease.post("/recipes", { ...recipe, userId });
    return response.data;
  }
);
// Creates pending action. fetchRecipes.pending: recipes/fetchRecipes/pending
// Also .fulfilled and .rejected
export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async () => {
    const response = await recipease.get("/recipes");
    return response.data;
  }
);
export const fetchRecipe = createAsyncThunk(
  "recipes/fetchRecipe",
  async (id) => {
    const response = await recipease.get(`/recipes/${id}`);
    return response.data;
  }
);
export const editRecipe = createAsyncThunk(
  "recipes/editRecipe",
  async (id, recipe) => {
    const response = await recipease.patch(`/recipes/${id}`, recipe);
    return response.data;
  }
);
export const deleteRecipe = createAsyncThunk(
  "recipes/deleteRecipe",
  async (id) => {
    await recipease.delete(`/recipes/${id}`);
    return id;
  }
);

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setUpdateStatus(state, action) {
      state.updateStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRecipe.pending, (state, action) => {
        state.updateStatus = "pending";
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.updateStatus = "idle";
        state.error = "";
        // Mutating code is allowed with redux toolkit
        const recipe = action.payload;
        state.recipes[recipe.id] = recipe;
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.updateStatus = "idle";
        state.error = "Error saving the recipe";
      })
      .addCase(fetchRecipes.pending, (state, action) => {
        state.updateStatus = "pending";
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.updateStatus = "idle";
        action.payload.forEach((recipe) => {
          state.recipes[recipe.id] = recipe;
        });
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.updateStatus = "idle";
      })
      .addCase(fetchRecipe.pending, (state, action) => {
        state.updateStatus = "pending";
      })
      .addCase(fetchRecipe.fulfilled, (state, action) => {
        state.updateStatus = "idle";
        const recipe = action.payload;
        state.recipes[recipe.id] = recipe;
      })
      .addCase(fetchRecipe.rejected, (state, action) => {
        state.updateStatus = "idle";
      })
      .addCase(editRecipe.pending, (state, action) => {
        state.updateStatus = "pending";
      })
      .addCase(editRecipe.fulfilled, (state, action) => {
        state.updateStatus = "idle";
        state.error = "";
        const recipe = action.payload;
        state.recipes[recipe.id] = recipe;
      })
      .addCase(editRecipe.rejected, (state, action) => {
        state.updateStatus = "idle";
        state.error = "Error saving the recipe";
      })
      .addCase(deleteRecipe.pending, (state, action) => {
        state.updateStatus = "pending";
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.updateStatus = "idle";
        delete state.recipes[action.payload];
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.updateStatus = "idle";
      });
    // TODO Try failures
  },
});

export const { setUpdateStatus } = recipeSlice.actions;

export default recipeSlice.reducer;