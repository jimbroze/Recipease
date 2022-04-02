import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { fetchRecipe } from "./recipeSlice";

const RecipeShow = (props) => {
  const dispatch = useDispatch();
  let params = useParams();

  const recipeId = params.recipeId;

  useEffect(() => {
    dispatch(fetchRecipe(recipeId));
  });
  // TODO Prevent update in edit mode.

  const recipe = useSelector((state) => state.recipes.recipes[recipeId]);

  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
    </div>
  );
};

export default RecipeShow;
