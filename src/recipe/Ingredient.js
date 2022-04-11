import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ingredientAdded,
  ingredientUpdated,
  ingredientRemoved,
} from "./recipeSlice";

const RecipeIngredient = (props) => {
  const dispatch = useDispatch();
  const ingredient = useSelector(
    (state) => state.recipes.currentRecipe.ingredients.byId[props.ingredientId]
  );
  const isNew = !props.ingredientId;
  const [ingredientText, setIngredientText] = useState(
    (ingredient || { text: "" }).text
  );
  const [isEditing, setIsEditing] = useState(isNew);

  const onIngredientChange = (event) => {
    setIngredientText(event.target.value);
  };

  const onIngredientEnter = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    event.target.blur();
  };

  const onBlur = (event) => {
    if (event.target.value.trim() === "") {
      if (!isNew) {
        dispatch(ingredientRemoved(props.ingredientId, props.sectionId));
      }
    } else if (isNew) {
      dispatch(ingredientAdded(props.sectionId, ingredientText));
      setIngredientText("");
    } else {
      dispatch(ingredientUpdated(props.ingredientId, ingredientText));
      setIsEditing(false);
    }
  };

  const renderIngredientText = () => {
    if (!props.isEditable) {
      return <p>{ingredientText}</p>;
    }
    if (!isEditing) {
      return <p onClick={() => setIsEditing(true)}>{ingredientText}</p>;
    }
  };

  const renderIngredientContent = () => {
    if (props.isEditable && isEditing) {
      return (
        <div className="field">
          <input
            placeholder="Add an ingredient"
            onChange={onIngredientChange}
            onKeyPress={onIngredientEnter}
            onBlur={onBlur}
            autoFocus={!isNew}
            value={ingredientText}
          />
        </div>
      );
    }
    return (
      <>
        <div className="right floated content">
          <div className="ui negative basic icon button">
            <i className="close icon"></i>
          </div>
        </div>
        <div className="header">{renderIngredientText()}</div>
      </>
    );
  };

  return (
    <div className="item" ref={props.innerRef} {...props.draggableProps}>
      <i {...props.dragHandleProps} className="arrows alternate icon large"></i>
      <div className="middle aligned content">{renderIngredientContent()}</div>
    </div>
  );
};

export default RecipeIngredient;
