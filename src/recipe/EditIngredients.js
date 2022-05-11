import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";

import Ingredient from "./Ingredient";
import MakeEditable from "./MakeEditable";
import Ingredients from "./Ingredients";
import {
  stepsSelectors,
  ingredientsSelectors,
  ingredientActions,
} from "./currentRecipeSlice";

const EditIngredients = ({ stepId }) => {
  const ingredientsIds = useSelector((state) => {
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

  const DragHandle = ({ isEditing, dragHandleProps }) => {
    if (isEditing) return null;
    return (
      <i
        {...dragHandleProps}
        className="middle aligned arrows alternate icon large"
      ></i>
    );
  };

  const CloseButton = ({ isEditing, onRemove }) => {
    if (isEditing) return null;
    return (
      <div
        className="right floated content"
        style={{ marginLeft: "auto", order: "2" }}
      >
        <div
          className="ui tiny negative basic icon button"
          onClick={() => onRemove()}
        >
          <i className="close icon"></i>
        </div>
      </div>
    );
  };

  const DraggableIngredient = (props) => {
    return (
      <Draggable
        draggableId={props.id}
        index={props.index}
        key={props.id}
        type="ingredients"
      >
        {(provided) => (
          <div
            className="item"
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
              display: "flex",
              alignItems: "center",
              ...provided.draggableProps.style,
            }}
          >
            <EditableIngredient {...props}>
              <CloseButton />
              <DragHandle dragHandleProps={provided.dragHandleProps} />
            </EditableIngredient>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <Droppable droppableId={droppableId} type="ingredients">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <Ingredients
            ingredientIds={ingredientsIds}
            ReplacementIngredient={DraggableIngredient}
            stepId={stepId}
            // childProps={childProps}
          />
          {provided.placeholder}
          <EditableIngredient containerId={stepId} isNotDraggable />
        </div>
      )}
    </Droppable>
  );
};

export default EditIngredients;
