import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";

import store from "../store";
import { errorAdded, errorRemoved, errorsCleared } from "../error/errorSlice";
import RecipeMethod from "./RecipeMethod";
// import Ingredients from "./Ingredients";
import ErrorSummary from "../error/ErrorSummary";
import LoadingSpinner from "../common/LoadingSpinner";

import {
  useGetRecipeQuery,
  useCreateRecipeMutation,
  useEditRecipeMutation,
} from "../api/apiSlice";

import {
  setCurrentRecipe,
  ingredientsMoved,
  stepsMoved,
} from "./currentRecipeSlice";

const RecipeAddEdit = (props) => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let params = useParams();
  const { userId } = useSelector((state) => state.auth);
  // const [pageErrors, setPageErrors] = useState({});
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm({
    mode: "onBlur",
  });
  const [createRecipe, { isLoading: isLoadingAdd }] = useCreateRecipeMutation();
  const [editRecipe, { isLoading: isLoadingEdit }] = useEditRecipeMutation();
  const isLoading = isLoadingAdd || isLoadingEdit;
  const canSave = isValid && isDirty && !isLoading;

  const recipeId = params.recipeId;
  const isNew = !recipeId;

  const {
    data: fetchedRecipe,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetRecipeQuery(recipeId, { skip: isNew });

  useEffect(() => {
    dispatch(errorsCleared());
  });
  useEffect(() => {
    // Populate initial form values and add ingredients & method to state.
    if (!isNew && fetchedRecipe) {
      reset(fetchedRecipe);
      dispatch(setCurrentRecipe(fetchedRecipe));
    }

    if (isNew || isSuccess) {
      dispatch(errorRemoved("fetchError"));
    } else if (isError) {
      dispatch(
        errorAdded({
          id: "fetchError",
          message: "Cannot fetch recipe",
          error,
        })
      );
    }
  }, [fetchedRecipe, isNew, isSuccess, isError, error]);

  const onSubmit = async (recipeData) => {
    if (!canSave) return;

    const { sections, steps, ingredients } = store.getState().currentRecipe;
    recipeData = { ...recipeData, sections, steps, ingredients };
    const submitAction = isNew ? createRecipe : editRecipe;

    dispatch(errorRemoved("saveError"));
    try {
      // var scope needed to use in finally block (hoisted)
      var recipe = await submitAction({ recipe: recipeData, userId }).unwrap();
    } catch (err) {
      dispatch(
        errorAdded({
          id: "saveError",
          message: "Cannot save recipe",
          error: err,
        })
      );
    } finally {
      navigate(`/recipes/${recipe.id}`);
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

  const onDragEnd = ({ destination, source, draggableId, type }) => {
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const moveAction = type === "ingredients" ? ingredientsMoved : stepsMoved;
    dispatch(
      moveAction({
        destination,
        source,
        id: draggableId,
      })
    );
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="ui form error">
        <Input name="title" label="Title" required />
        <Input type="textarea" name="description" label="Description" />

        {/* <div class="meta">
        <span class="price">$1200</span>
        <span class="stay">1 Month</span>
      </div> */}

        <DragDropContext onDragEnd={onDragEnd}>
          {/* <h3>Ingredients</h3>
        <Ingredients /> */}
          <h3>Method</h3>
          <RecipeMethod />
        </DragDropContext>
        <button
          className={
            "ui button " +
            (isLoading ? "loading " : "") +
            (canSave ? "" : "disabled ") +
            "primary"
          }
          type="submit"
        >
          Submit
        </button>
      </form>
    );
  };

  const renderContent = () => {
    if (isNew || isSuccess) {
      return renderForm();
    } else if (isFetching) {
      return <LoadingSpinner text="Loading recipe" />;
    } else if (isError) {
      return <div></div>;
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>{isNew ? "New" : "Edit"} Recipe</h1>
      <ErrorSummary />
      {renderContent()}
    </div>
  );
};

export default RecipeAddEdit;
