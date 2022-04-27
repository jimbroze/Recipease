import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useGetRecipesQuery } from "../api/apiSlice";
import LoadingSpinner from "../common/LoadingSpinner";

const RecipeList = (props) => {
  const {
    data: recipes = [],
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetRecipesQuery();

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
      // TODO replace with loading spinner
    } else if (isSuccess) {
      return renderRecipes();
    } else if (isError) {
      console.log(`${error.status}: ${error.error}`);
      return <div>Error fetching recipes</div>;
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
      <h2>Recipes</h2>
      {renderContent()}
    </div>
  );
};

export default RecipeList;
