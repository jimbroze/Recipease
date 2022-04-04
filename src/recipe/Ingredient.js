import React from "react";
import { Draggable } from "react-beautiful-dnd";

const RecipeIngredient = (props) => {
  console.log(props.ingredient);
  return (
    <Draggable draggableId={props.ingredient.id.toString()} index={props.index}>
      {(provided) => (
        <div
          className="item"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <i className="utensil spoon icon"></i>
          <div className="content">{props.ingredient.name}</div>
        </div>
      )}
    </Draggable>
  );
};

export default RecipeIngredient;
