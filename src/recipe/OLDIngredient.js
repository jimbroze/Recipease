import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ingredientsSelectors,
  ingredientAdded,
  ingredientUpdated,
  ingredientRemoved,
} from "./currentRecipeSlice";

const Ingredient = (props) => {
  const dispatch = useDispatch();
  const ingredient = useSelector((state) =>
    ingredientsSelectors.selectById(state, props.ingredientId)
  );
  const isNew = !props.ingredientId;
  const [ingredientText, setIngredientText] = useState(
    (ingredient || { text: "" }).text
  );
  const [isEditing, setIsEditing] = useState(isNew);

  const removeIngredient = () => {
    dispatch(
      ingredientRemoved({
        ingredientId: props.ingredientId,
        stepId: props.stepId,
      })
    );
  };

  const onChange = (event) => {
    setIngredientText(event.target.value);
  };

  const onEnter = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    event.target.blur();
  };

  const onBlur = (event) => {
    if (event.target.value.trim() === "") {
      if (!isNew) {
        removeIngredient();
      }
    } else if (isNew) {
      dispatch(
        ingredientAdded({
          ingredient: { text: ingredientText },
          stepId: props.stepId,
        })
      );
      setIngredientText("");
    } else {
      dispatch(
        ingredientUpdated({ id: props.ingredientId, text: ingredientText })
      );
      setIsEditing(false);
    }
  };

  const renderIngredientContent = () => {
    if (props.isEditable && isEditing) {
      return (
        <div className="field">
          <input
            placeholder="Add an ingredient"
            onChange={onChange}
            onKeyPress={onEnter}
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
            <i className="close icon" onClick={() => removeIngredient()}></i>
          </div>
        </div>
        <div className="header">
          <p {...(!isEditing ? { onClick: () => setIsEditing(true) } : {})}>
            {ingredientText}
          </p>
        </div>
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

export default Ingredient;
