import {
  // useParams,
  useNavigate,
  // useLocation,
} from "react-router-dom";

import {
  RECIPE_CREATED,
  RECIPES_LOADED,
  RECIPE_LOADED,
  RECIPE_EDITED,
  RECIPE_DELETED,
} from "./recipeActionTypes";
import recipease from "../../api/recipease";

// TODO Ensure recipes are normalized. Stored as object with ID as key.
// TODO Use RTK to fetch and cache data?

export const createRecipe = (recipe) => async (dispatch, getState) => {
  // Get userId state with getState and post to API
  const { userId } = getState().auth;
  const response = await recipease.post("/recipes", { ...recipe, userId });
  dispatch({ type: RECIPE_CREATED, payload: response.data });
  let navigate = useNavigate();
  navigate("/");
};

export const fetchRecipes = () => async (dispatch) => {
  const response = await recipease.get("/recipes");
  dispatch({ type: RECIPES_LOADED, payload: response.data });
};

export const fetchRecipe = (id) => async (dispatch) => {
  const response = await recipease.get(`/recipes/${id}`);
  dispatch({ type: RECIPE_LOADED, payload: response.data });
};

export const editRecipe = (id, recipe) => async (dispatch) => {
  // PUT would replace ALL properties.
  const response = await recipease.patch(`/recipes/${id}`, recipe);
  dispatch({ type: RECIPE_EDITED, payload: response.data });
  let navigate = useNavigate();
  navigate("/");
};

export const deleteRecipe = (id) => async (dispatch) => {
  await recipease.delete(`/recipes/${id}`);
  dispatch({ type: RECIPE_DELETED, payload: id });
  let navigate = useNavigate();
  navigate("/");
};
