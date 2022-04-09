import React from "react";
import { Draggable } from "react-beautiful-dnd";

import RecipeIngredient from "./Ingredient";

const RecipeIngredients = (props) => {
  return (
    // TODO make ul?
    <div className="ui relaxed list" ref={props.innerRef}>
      {props.ingredientOrder.map((ingredientId, index) => (
        <Draggable
          draggableId={ingredientId.toString()}
          index={index}
          key={ingredientId}
        >
          {(provided) => (
            <RecipeIngredient
              ingredientId={ingredientId}
              innerRef={provided.innerRef}
              draggableProps={provided.draggableProps}
              dragHandleProps={provided.dragHandleProps}
              isEditable={true}
            />
          )}
        </Draggable>
      ))}
      {props.placeholder}
      <RecipeIngredient sectionId={props.sectionId} isEditable={true} />
    </div>
  );
};

export default RecipeIngredients;
