import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Field } from "react-final-form";
// import { DragDropContext } from "react-beautiful-dnd";

import { createRecipe, editRecipe, setUpdateStatus } from "./recipeSlice";

const RecipeAddEdit = (props) => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let params = useParams();
  const { updateStatus, error } = useSelector((state) => state.recipes);

  const recipeId = params.recipeId;
  const isNew = !recipeId;
  const canSave = updateStatus === "idle";

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

  return (
    <Form
      initialValues={props.initialValues}
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
          <button className="ui button primary" type="submit">
            Submit
          </button>
        </form>
      )}
    />
  );
};

export default RecipeAddEdit;
