import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchRecipe } from "./state/recipeActions";

const RecipeShow = (props) => {
  const dispatch = useDispatch();
  const recipeId = props.match.params.id;

  useEffect(() => {
    dispatch(fetchRecipe(recipeId));
  });
  // TODO Prevent update in edit mode.

  const recipe = useSelector((state) => state.recipes[recipeId]);

  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
    </div>
  );
};

export default RecipeShow;
