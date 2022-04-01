import React from "react";
import { useDispatch } from "react-redux";

import Recipe from "./Recipe";

const RecipeEdit = (props) => {
  const dispatch = useDispatch();
  const recipeId = props.match.params.id;
  const recipe = useSelector((state) => state.recipes[recipeId]);

  useEffect(() => {
    dispatch(fetchRecipe(recipeId));
  });

  onSubmit = (formValues) => {
    dispatch(EditRecipe(recipeId, formValues));
  };

  <Recipe recipeData={recipe} onSubmit={onSubmit} />;
};

export default RecipeEdit;
