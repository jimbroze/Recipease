import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchRecipes } from "../recipe/recipesSlice";

const RecipeList = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRecipes());
  }, []);

  const recipes = useSelector((state) => state.recipes);
  const recipeArray = Object.values(recipes);

  const renderedRecipes = recipeArray.map((recipe) => {
    return (
      <div className="item" key={recipe.id}>
        <div className="content">
          <Link to={`/recipes/${recipe.id}`} className="header">
            {recipe.title}
          </Link>
        </div>
      </div>
    );
  });

  const renderedCreate = () => {
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
      {renderedCreate()}
      <h2>Recipes</h2>
      <div className="ui celled list">{renderedRecipes}</div>
    </div>
  );
};

export default RecipeList;
