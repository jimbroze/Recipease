import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";

import RecipeMethod from "./RecipeMethod";
// import Ingredients from "./Ingredients";
import ErrorSummary from "../common/ErrorSummary";
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
  const [pageErrors, setPageErrors] = useState({});
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
    // Populate initial form values
    if (!isNew && fetchedRecipe) {
      reset(fetchedRecipe);
    }
  }, [fetchedRecipe]);

  // TODO merge form data with state. Collect required data from form
  const onSubmit = async (recipeData) => {
    var submitAction = function () {
      return isNew
        ? createRecipe({ ...recipeData, userId })
        : editRecipe(recipeData);
    };

    if (canSave) {
      setPageErrors((pageErrors) => {
        const newPageErrors = { ...pageErrors };
        delete newPageErrors["saveError"];
        return newPageErrors;
      });
      try {
        // var scope needed to use in finally block (hoisted)
        var recipe = await submitAction().unwrap();
      } catch (err) {
        console.error("Failed to save the recipe: ", err);
        setPageErrors({
          ...pageErrors,
          saveError: { message: "Failed to save the recipe" },
        });
      } finally {
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
    // TODO convert errors to global redux state
    if (isNew || isSuccess) {
      if ("fetchError" in pageErrors) {
        setPageErrors((pageErrors) => {
          const newPageErrors = { ...pageErrors };
          delete newPageErrors["fetchError"];
          return newPageErrors;
        });
      }
      return renderForm();
    } else if (isFetching) {
      return <LoadingSpinner text="Loading recipe" />;
    } else if (isError && !("fetchError" in pageErrors)) {
      console.log(`${error.status}: ${error.error}`);
      setPageErrors({
        ...pageErrors,
        fetchError: { message: "Cannot fetch recipe" },
      });
      return <div></div>;
    }
  };

  return (
    <div>
      <ErrorSummary errors={pageErrors} />
      {renderContent()}
    </div>
  );
};

export default RecipeAddEdit;
