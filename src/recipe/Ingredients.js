import React from "react";
import RecipeIngredient from "./Ingredient";

const RecipeIngredients = (props) => {
  const ingredientArray = Object.values(props.ingredients);
  return (
    <ul ref={props.innerRef}>
      {ingredientArray.map((ingredient, index) => (
        <RecipeIngredient
          ingredient={ingredient}
          index={index}
          key={ingredient.id}
        />
      ))}
      {props.placeholder}
    </ul>
  );
};

export default RecipeIngredients;
