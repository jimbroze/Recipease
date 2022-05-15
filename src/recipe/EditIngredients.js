import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";

import { Icon, Button, Item, Ref } from "semantic-ui-react";

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
      <Icon
        name="arrows alternate"
        size="large"
        className="middle aligned"
        {...dragHandleProps}
      />
    );
  };

  const CloseButton = ({ isEditing, onRemove }) => {
    if (isEditing) return null;
    return (
      <Button
        basic
        negative
        size="tiny"
        icon="close"
        onClick={() => onRemove()}
        style={{ marginLeft: "auto", order: "2" }} // Float to right
      />
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
          />
          {provided.placeholder}
          <EditableIngredient containerId={stepId} isNotDraggable />
        </div>
      )}
    </Droppable>
  );
};

export default EditIngredients;
