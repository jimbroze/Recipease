import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { Form, Field } from "react-final-form";

const RecipeIngredient = (props) => {
  const isNew = props.index === props.fields.length - 1;

  const onIngredientEnter = (fields) => (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    event.target.blur();
  };

  const onBlur = (fields) => (event) => {
    if (event.target.value.trim() === "") {
      if (!isNew) {
        fields.remove(props.index);
      }
    } else if (isNew) {
      fields.push(null);
    }
  };

  return (
    <Draggable
      // FIXME still moves when disabled
      isDragDisabled={isNew}
      draggableId={props.id}
      index={props.index}
    >
      {(provided) => (
        <div
          className="item"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <i className="utensil spoon icon"></i>
          <div className="content">
            <Field name={`${props.id}.ingredient`}>
              {({ input, meta }) => (
                <input
                  {...input}
                  type="text"
                  placeholder="Add an ingredient"
                  onKeyPress={onIngredientEnter(props.fields)}
                  onBlur={onBlur(props.fields)}
                />
              )}
            </Field>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default RecipeIngredient;
