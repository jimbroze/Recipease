import React from "react";
import RecipeIngredient from "./Ingredient";
import IngredientCreate from "./IngredientCreate";

const RecipeIngredients = (props) => {
  return (
    // TODO make ul?
    <div className="ui relaxed list" ref={props.innerRef}>
      {props.ingredientOrder.map((ingredientId, index) => (
        <RecipeIngredient
          ingredient={props.ingredients.byId[ingredientId]}
          index={index}
          key={ingredientId}
        />
      ))}
      {props.placeholder}
      <IngredientCreate sectionId={props.sectionId} />
    </div>
  );
};

export default RecipeIngredients;
