import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { useGetRecipeQuery } from "../api/apiSlice";
import { errorAdded, errorRemoved, errorsCleared } from "../error/errorSlice";
import { setCurrentRecipe } from "./currentRecipeSlice";
import ErrorSummary from "../error/ErrorSummary";
import LoadingSpinner from "../common/LoadingSpinner";
import Ingredients from "./Ingredients";
import Method from "./Method";

const RecipeShow = (props) => {
  const dispatch = useDispatch();
  let params = useParams();
  const recipeId = params.recipeId;

  const {
    data: recipe = [],
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetRecipeQuery(recipeId);

  useEffect(() => {
    dispatch(errorsCleared());
  });
  useEffect(() => {
    if (isSuccess) {
      dispatch(errorRemoved("fetchError"));

      dispatch(setCurrentRecipe(recipe));
    } else if (isError) {
      dispatch(
        errorAdded({
          id: "fetchError",
          message: "Cannot fetch recipe",
          error,
        })
      );
    }
  }, [recipe, isSuccess, isError, error]);

  const renderRecipe = () => {
    return (
      <div>
        <h1>{recipe.title}</h1>
        <p>{recipe.description}</p>
        <h3>Ingredients</h3>
        <Ingredients ingredientIds={recipe.ingredients.ids} />
        <h3>Method</h3>
        <Method />
      </div>
    );
  };

  const renderContent = () => {
    if (isSuccess) {
      return renderRecipe();
    } else if (isFetching) {
      return <LoadingSpinner text="Loading recipe" />;
    } else if (isError) {
      return <div></div>;
    }
  };

  return (
    <div>
      <ErrorSummary />
      {renderContent()}
    </div>
  );
};

export default RecipeShow;
