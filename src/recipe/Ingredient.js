import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Field } from "react-final-form";

import { ingredientAdded, ingredientUpdated } from "./recipeSlice";

const RecipeIngredient = (props) => {
  const dispatch = useDispatch();
  const ingredient = useSelector(
    (state) => state.recipes.currentRecipe.ingredients.byId[props.ingredientId]
  );
  const isNew = !props.ingredientId;
  const initIngredient = ingredient || { text: "" };
  const [ingredientText, setIngredientText] = useState(initIngredient.text);
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
    if (isNew) {
      dispatch(ingredientAdded(props.sectionId, ingredientText));
      setIngredientText("");
    } else {
      dispatch(ingredientUpdated(props.ingredientId, ingredientText));
      setIsEditing(false);
    }
  };

  const renderIngredientText = () => {
    if (!props.isEditable) {
      return <span>{ingredientText}</span>;
    }
    if (!isEditing) {
      return <span onClick={() => setIsEditing(true)}>{ingredientText}</span>;
    }
    return (
      <Field name="ingredient">
        {({ input, meta }) => (
          <div className="field">
            <input
              {...input}
              type="text"
              placeholder="Add an ingredient"
              onChange={onIngredientChange}
              onKeyPress={onIngredientEnter}
              onBlur={onBlur}
              value={ingredientText}
            />
          </div>
        )}
      </Field>
    );
  };

  return (
    <div
      className="item"
      ref={props.innerRef}
      {...props.draggableProps}
      {...props.dragHandleProps}
    >
      <i className="utensil spoon icon"></i>
      <div className="content">{renderIngredientText()}</div>
    </div>
  );
};

export default RecipeIngredient;
