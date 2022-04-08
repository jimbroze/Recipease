import React from "react";
import { FieldArray } from "react-final-form-arrays";
import { Droppable } from "react-beautiful-dnd";

import RecipeIngredient from "./Ingredient";

const RecipeIngredients = (props) => {
  return (
    // TODO make ul?
    // <FieldArray name={`ingredients.${props.sectionId}`}>
    <FieldArray name={`ingredients`}>
      {({ fields }) => (
        <Droppable droppableId={props.sectionId.toString()}>
          {(provided) => (
            <div
              className="ui relaxed list"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {fields.map((name, index) => (
                <RecipeIngredient
                  index={index}
                  key={name}
                  id={name}
                  fields={fields}
                  sectionId={props.sectionId}
                />
              ))}
              {provided.placeholder}
              {/* <RecipeIngredient fields={props.fields} /> */}
            </div>
          )}
        </Droppable>
      )}
    </FieldArray>
  );
};

export default RecipeIngredients;
