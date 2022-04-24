import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";

import Ingredient from "./Ingredient";
import MakeEditable from "./MakeEditable";
import {
  stepsSelectors,
  ingredientsSelectors,
  ingredientActions,
} from "./currentRecipeSlice";

const RecipeIngredients = ({ stepId }) => {
  const ingredients = useSelector((state) => {
    if (stepId) {
      return stepsSelectors.selectById(state, stepId).ingredients;
    }
    return ingredientsSelectors.selectIds(state);
  });

  const droppableId = stepId ? stepId : "AllIngredients";

  const EditableIngredient = MakeEditable(
    Ingredient,
    ingredientsSelectors,
    ingredientActions,
    "Add a new ingredient"
  );

  return (
    // TODO make ul?
    <Droppable droppableId={droppableId} type="ingredients">
      {(provided) => (
        <div
          className="ui middle aligned relaxed celled selection list"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {ingredients.map((ingredientId, index) => (
            <Draggable
              draggableId={ingredientId}
              index={index}
              key={ingredientId}
              type="ingredients"
            >
              {(provided) => (
                <EditableIngredient
                  id={ingredientId}
                  containerId={stepId}
                  innerRef={provided.innerRef}
                  draggableProps={provided.draggableProps}
                  dragHandleProps={provided.dragHandleProps}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
          {/* <Ingredient stepId={stepId} isEditable={true} /> */}
          <EditableIngredient containerId={stepId} />
        </div>
      )}
    </Droppable>
  );
};

export default RecipeIngredients;
