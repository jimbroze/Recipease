import React from "react";
import { List } from "semantic-ui-react";

import Ingredient from "./Ingredient";

const Ingredients = ({ ingredientIds, stepId, ReplacementIngredient }) => {
  const IngredientComp = ReplacementIngredient || Ingredient;
  return (
    <List relaxed celled selection verticalAlign="middle">
      {ingredientIds.map((ingredientId, index) => (
        <List.Item>
          <IngredientComp
            id={ingredientId}
            key={ingredientId}
            index={index}
            containerId={stepId}
          />
        </List.Item>
      ))}
    </List>
  );
};

export default Ingredients;
