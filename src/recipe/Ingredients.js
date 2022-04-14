import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";

import RecipeIngredient from "./Ingredient";
import { stepsSelectors, ingredientsSelectors } from "./currentRecipeSlice";

const RecipeIngredients = (props) => {
  const ingredients = useSelector((state) => {
    if (props.stepId) {
      return stepsSelectors.selectById(state, props.stepId).ingredients;
    }
    return ingredientsSelectors.selectIds(state);
  });

  return (
    // TODO make ul?
    <div className="ui relaxed celled selection list" ref={props.innerRef}>
      {ingredients.map((ingredientId, index) => (
        <Draggable
          draggableId={ingredientId.toString()}
          index={index}
          key={ingredientId}
        >
          {(provided) => (
            <RecipeIngredient
              stepId={props.stepId}
              ingredientId={ingredientId}
              isEditable={true}
              innerRef={provided.innerRef}
              draggableProps={provided.draggableProps}
              dragHandleProps={provided.dragHandleProps}
            />
          )}
        </Draggable>
      ))}
      {props.placeholder}
      <RecipeIngredient stepId={props.stepId} isEditable={true} />
    </div>
  );
};

export default RecipeIngredients;
