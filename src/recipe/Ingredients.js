import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";

import RecipeIngredient from "./Ingredient";

const RecipeIngredients = (props) => {
  const ingredients = useSelector(
    (state) =>
      state.recipes.currentRecipe.sections.byId[props.sectionId].ingredients
  );

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
              sectionId={props.sectionId}
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
      <RecipeIngredient sectionId={props.sectionId} isEditable={true} />
    </div>
  );
};

export default RecipeIngredients;
