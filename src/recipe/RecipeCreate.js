import React from "react";
import { useDispatch } from "react-redux";

import Recipe from "./Recipe";

const RecipeCreate = (props) => {
  const dispatch = useDispatch();

  onSubmit = (formValues) => {
    dispatch(CreateRecipe(formValues));
  };

  <Recipe onSubmit={onSubmit} />;
};

export default RecipeCreate;
