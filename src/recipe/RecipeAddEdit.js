import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";

import Ingredients from "./Ingredients";
import ErrorSummary from "../common/ErrorSummary";

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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

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

  const renderError = (name) => {
    if (errors[name]) {
      return (
        <div className="ui pointing red basic label">
          {/* <div className="ui error message"> */}
          <div className="header">{errors[name]?.message}</div>
        </div>
      );
    }
  };

  const Input = ({ type, name, label, required }) => {
    const InputType = type || "input";
    const className = `field ${errors[name] ? "error" : ""}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <InputType
          type={type || "text"}
          {...register(name, {
            required: {
              value: required || false,
              message: `Please give your recipe a ${name}`,
            },
          })}
          autoComplete="off"
        />
        {renderError(name)}
      </div>
    );
  };
  // To fire onchange:
  // register('name', {
  //   onChange: (e) => console.log(e)
  // })

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
    // FIXME intitial values
    <form onSubmit={handleSubmit(onSubmit)} className="ui form error">
      {/* <ErrorSummary errors={errors} /> */}
      <Input name="title" label="Enter Title" required />
      <Input type="textarea" name="description" label="Enter Description" />

      <h3>Steps</h3>
      <DragDropContext onDragEnd={onDragEnd}>{renderSections}</DragDropContext>
      <button className="ui button primary" type="submit">
        Submit
      </button>
    </form>
  );
};

export default RecipeAddEdit;
