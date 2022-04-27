import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { useGetRecipeQuery } from "../api/apiSlice";

const RecipeShow = (props) => {
  let params = useParams();
  const recipeId = params.recipeId;

  const {
    data: recipe = [],
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetRecipeQuery(recipeId);

  const renderRecipe = () => {
    return (
      <div>
        <h1>{recipe.title}</h1>
        <p>{recipe.description}</p>
      </div>
    );
  };

  const renderContent = () => {
    if (isSuccess) {
      return renderRecipe();
    } else if (isFetching) {
      return <div>loading</div>;
      // TODO replace with loading spinner
    } else if (isError) {
      console.log(`${error.status}: ${error.error}`);
      return <div>Error fetching recipes</div>;
    }
  };

  return <div>{renderContent()}</div>;
};

export default RecipeShow;
