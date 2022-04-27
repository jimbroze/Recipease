import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";

import RecipeMethod from "./RecipeMethod";
// import Ingredients from "./Ingredients";
import ErrorSummary from "../common/ErrorSummary";

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
  const [pageErrors, setPageErrors] = useState([]);

  const [createRecipe, { isloading: isLoadingAdd }] = useCreateRecipeMutation();
  const [editRecipe, { isLoading: isLoadingEdit }] = useEditRecipeMutation();
  const isLoading = isLoadingAdd || isLoadingEdit;
  const canSave = !isLoading;

  const recipeId = params.recipeId;
  const isNew = !recipeId;

  const {
    data: fetchedRecipe,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetRecipeQuery(recipeId, { skip: isNew });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
  });

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
      try {
        // var scope needed to use in finally block (hoisted)
        var recipe = await submitAction().unwrap();
      } catch (err) {
        console.error("Failed to save the recipe: ", err);
        setPageErrors([{ message: "Failed to save the recipe" }]);
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
        <ErrorSummary errors={pageErrors} />
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
        <button className="ui button primary" type="submit">
          Submit
        </button>
      </form>
    );
  };

  const renderContent = () => {
    if (isNew || isSuccess) {
      return renderForm();
    } else if (isFetching) {
      return <div>loading</div>;
      // TODO replace with loading spinner
    } else if (isError) {
      console.log(`${error.status}: ${error.error}`);
      setPageErrors([{ message: "Cannot fetch recipe" }]);
      return <div></div>;
    }
  };

  return <div>{renderContent()}</div>;
};

export default RecipeAddEdit;
