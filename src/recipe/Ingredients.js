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

const RecipeIngredients = (props) => {
  const ingredients = useSelector((state) => {
    if (props.stepId) {
      return stepsSelectors.selectById(state, props.stepId).ingredients;
    }
    return ingredientsSelectors.selectIds(state);
  });

  const droppableId = props.stepId ? props.stepId : "AllIngredients";

  const EditableIngredient = MakeEditable(
    Ingredient,
    "input",
    ingredientsSelectors,
    ingredientActions,
    props.stepId,
    "Add a new ingredient"
  );
  return (
    // TODO make ul?
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          className="ui relaxed celled selection list"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {ingredients.map((ingredientId, index) => (
            <Draggable
              draggableId={ingredientId}
              index={index}
              key={ingredientId}
            >
              {(provided) => (
                <EditableIngredient
                  id={ingredientId}
                  innerRef={provided.innerRef}
                  draggableProps={provided.draggableProps}
                  dragHandleProps={provided.dragHandleProps}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
          {/* <Ingredient stepId={props.stepId} isEditable={true} /> */}
          <EditableIngredient />
        </div>
      )}
    </Droppable>
  );
};

export default RecipeIngredients;
