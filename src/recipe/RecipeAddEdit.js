import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Field } from "react-final-form";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Ingredients from "./Ingredients";

import {
  fetchRecipe,
  createRecipe,
  editRecipe,
  setCurrentRecipe,
  ingredientsMoved,
  setUpdateStatus,
} from "./recipeSlice";

const RecipeAddEdit = (props) => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let params = useParams();
  const { updateStatus, error } = useSelector((state) => state.recipes);

  const recipeId = params.recipeId;
  const isNew = !recipeId;
  const canSave = updateStatus === "idle";

  useEffect(() => {
    dispatch(fetchRecipe(recipeId));
  }, [recipeId]);

  // const recipeData = useSelector((state) => state.recipes.recipes[recipeId]);
  if (!isNew) {
    dispatch(setCurrentRecipe(recipeId));
  }
  const currentRecipe = useSelector((state) => state.recipes.currentRecipe);

  // TODO merge form data with state. Collect required data from form
  const onSubmit = async (recipeData) => {
    var submitAction = function () {
      return isNew
        ? createRecipe(recipeData)
        : editRecipe(recipeId, recipeData);
    };

    if (canSave) {
      try {
        dispatch(setUpdateStatus("pending"));
        var recipe = await dispatch(submitAction()).unwrap();
      } catch (err) {
        console.error("Failed to save the recipe: ", err);
      } finally {
        dispatch(setUpdateStatus("idle"));
        navigate(`/recipes/${recipe.id}`);
      }
    }
  };

  const renderFormError = () => {
    if (error)
      return (
        <div className="ui error message">
          <div className="header">{error}</div>
        </div>
      );
  };

  const validate = (formValues) => {
    const errors = {};

    if (!formValues.title) {
      errors.title = "Please give your recipe a title";
    }

    if (!formValues.description) {
      errors.description = "Please give your recipe a description";
    }

    return errors;
  };

  const renderError = ({ error, touched }) => {
    if (touched && error) {
      return (
        <div className="ui error message">
          <div className="header">{error}</div>
        </div>
      );
    }
  };

  const renderInput = ({ input, label, meta }) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} autoComplete="off" />
        {renderError(meta)}
      </div>
    );
  };

  const onDragEnd = ({ destination, source, draggableId }) => {
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    dispatch(ingredientsMoved(destination, source, draggableId));
  };

  const renderSections = currentRecipe.sections.allIds.map((sectionId) => {
    const recipeSection = currentRecipe.sections.byId[sectionId];
    return (
      <div key={recipeSection.id}>
        {/* <Field>{recipeSection.sectionName}</Field> */}
        <h4>Ingredients</h4>

        <Droppable droppableId={recipeSection.id.toString()}>
          {(provided) => (
            <Ingredients
              innerRef={provided.innerRef}
              {...provided.droppableProps}
              placeholder={provided.placeholder}
              sectionId={recipeSection.id}
            />
          )}
        </Droppable>

        {/* <Instructions /> */}
      </div>
    );
  });

  return (
    <Form
      // FIXME intitial values
      // initialValues={recipeData}
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className="ui form error">
          {renderFormError()}
          <Field name="title" component={renderInput} label="Enter Title" />
          <Field
            name="description"
            component={renderInput}
            label="Enter Description"
          />
          {/* <Field name="steps" component={} label="" /> */}
          <h3>Steps</h3>
          <DragDropContext onDragEnd={onDragEnd}>
            {renderSections}
          </DragDropContext>
          <button className="ui button primary" type="submit">
            Submit
          </button>
        </form>
      )}
    />
  );
};

export default RecipeAddEdit;
