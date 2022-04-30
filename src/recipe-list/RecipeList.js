import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useGetRecipesQuery } from "../api/apiSlice";
import { errorAdded, errorRemoved, errorsCleared } from "../error/errorSlice";
import ErrorSummary from "../error/ErrorSummary";
import LoadingSpinner from "../common/LoadingSpinner";

const RecipeList = (props) => {
  const dispatch = useDispatch();
  const {
    data: recipes = [],
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetRecipesQuery();

  useEffect(() => {
    dispatch(errorsCleared());
  });
  useEffect(() => {
    if (isSuccess) {
      dispatch(errorRemoved("fetchError"));
    } else if (isError) {
      dispatch(
        errorAdded({
          id: "fetchError",
          message: "Cannot fetch recipes",
          error,
        })
      );
    }
  }, [isSuccess, isError, error]);

  const renderRecipes = () => {
    return (
      <div className="ui celled list">
        {recipes.map((recipe) => (
          <div className="item" key={recipe.id}>
            <div className="content">
              <Link to={`/recipes/${recipe.id}`} className="header">
                {recipe.title}
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner text="Loading recipes" />;
    } else if (isSuccess) {
      return renderRecipes();
    } else if (isError) {
      return <div></div>;
    }
  };

  const renderCreateButton = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <Link to="/recipes/new" className="ui button primary">
          Create Recipe
        </Link>
      </div>
    );
  };

  return (
    <div>
      {renderCreateButton()}
      <h1>Recipes</h1>
      <ErrorSummary />
      {renderContent()}
    </div>
  );
};

export default RecipeList;
