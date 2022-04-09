import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Field } from "react-final-form";

import { ingredientAdded } from "./recipeSlice";

const IngredientCreate = (props) => {
  const dispatch = useDispatch();
  const [newIngredient, setNewIngredient] = useState("");

  const onIngredientChange = (event) => {
    setNewIngredient(event.target.value);
  };

  const onIngredientEnter = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    dispatch(ingredientAdded(props.sectionId, newIngredient));
    setNewIngredient("");
  };

  return (
    <Field name="newIngredient">
      {({ input, meta }) => (
        <div className="field">
          <input
            {...input}
            type="text"
            placeholder="Add an ingredient"
            onChange={onIngredientChange}
            onKeyPress={onIngredientEnter}
            value={newIngredient}
          />
        </div>
      )}
    </Field>
  );
};

export default IngredientCreate;
