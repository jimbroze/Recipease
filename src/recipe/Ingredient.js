import React from "react";
import { Field } from "react-final-form";
import { Draggable } from "react-beautiful-dnd";

const RecipeIngredient = (props) => {
  return (
    <Draggable
      draggableId={"ingredient" + props.ingredient.id}
      index={props.index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          srtesnte
          <Field name="title" component={"input"} label="Enter Title" />
        </div>
      )}
    </Draggable>
  );
};

export default RecipeIngredient;
