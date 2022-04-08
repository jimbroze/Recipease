import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
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

  // FIXME error in fetch refreshes form on new recipe form
  useEffect(() => {
    dispatch(fetchRecipe(recipeId));
  }, [recipeId]);

  // const recipeData = useSelector((state) => state.recipes.recipes[recipeId]);
  if (!isNew) {
    dispatch(setCurrentRecipe(recipeId));
  }
  const currentRecipe = useSelector((state) => state.recipes.currentRecipe);

  // TODO merge form data with state. Collect required data from form
  // TODO Remove empty ingredient on save
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

  // const onDragEnd = ({ destination, source, draggableId }) => {
  //   if (!destination) {
  //     return;
  //   }
  //   if (
  //     destination.droppableId === source.droppableId &&
  //     destination.index === source.index
  //   ) {
  //     return;
  //   }
  //   dispatch(ingredientsMoved(destination, source, draggableId));
  // };

  const onDragEnd =
    (insert, remove) =>
    ({ destination, source, draggableId }) => {
      // dropped outside the list
      if (!destination) {
        return;
      }
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      remove(`Ingredients.${source.droppableId}`, source.index);
      insert(
        `Ingredients.${destination.droppableId}`,
        destination.index,
        draggableId
      );
    };

  const renderSections = currentRecipe.sections.allIds.map((sectionId) => {
    // const recipeSection = currentRecipe.sections.byId[sectionId];
    const recipeSection = { id: 0 };
    console.log(recipeSection.id);
    return (
      <div key={recipeSection.id}>
        {/* <Field>{recipeSection.sectionName}</Field> */}
        <h4>Ingredients</h4>
        <Ingredients
          // innerRef={provided.innerRef}
          // {...provided.droppableProps}
          // ingredients={currentRecipe.ingredients}
          // placeholder={provided.placeholder}
          sectionId={recipeSection.id}
        />
        {/* <Instructions /> */}
      </div>
    );
  });

  const logValues = (values) => {
    console.log(values);
  };

  const initValues = {
    ingredients: [null],
  };

  return (
    <Form
      // FIXME intitial values
      // initialValues={recipeData}
      initialValues={initValues}
      // subscription={{}}
      // onSubmit={onSubmit}
      onSubmit={logValues}
      validate={validate}
      mutators={{
        // potentially other mutators could be merged here
        ...arrayMutators,
      }}
      render={({
        handleSubmit,
        form: {
          mutators: { push, pop, insert, remove },
        },
        pristine,
        form,
        submitting,
        values,
      }) => (
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
          <DragDropContext onDragEnd={onDragEnd(insert, remove)}>
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
