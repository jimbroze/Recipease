import React from "react";

import Ingredient from "./Ingredient";

const Ingredients = ({ ingredientIds, stepId, ReplacementIngredient }) => {
  const IngredientComp = ReplacementIngredient || Ingredient;
  return (
    <div className="ui middle aligned relaxed celled selection list">
      {ingredientIds.map((ingredientId, index) => (
        <IngredientComp
          id={ingredientId}
          key={ingredientId}
          index={index}
          containerId={stepId}
        />
      ))}
    </div>
  );
};

export default Ingredients;
