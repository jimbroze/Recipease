import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";

import { Form, Input, Header, Button, Label } from "semantic-ui-react";
import Textarea from "react-textarea-autosize";

import store from "../store";
import { errorAdded, errorRemoved, errorsCleared } from "../error/errorSlice";
import EditSteps from "./EditSteps";
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
  const recipeId = params.recipeId;
  const isNew = !recipeId;
  const canSave = isValid && !isLoading && (isDirty || !isNew);

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
        <Label pointing color="red" basic>
          {/* <div className="ui error message"> */}
          <Header>{errors[name]?.message}</Header>
        </Label>
      );
    }
  };

  const RecipeInput = ({ type, name, label, required }) => {
    // TODO Change input to Sem UI component. Doesn't work with hook form.
    const InputType = type || "input";
    const errorClass = `${errors[name] ? "error" : ""}`;
    return (
      <Form.Field className={errorClass}>
        <label>{label}</label>
        <InputType
          // type={type || "text"}
          {...register(name, {
            required: {
              value: required || false,
              message: `Please give your recipe a ${name}`,
            },
          })}
          autoComplete="off"
        />
        {renderError(name)}
      </Form.Field>
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
      <Form onSubmit={handleSubmit(onSubmit)} error>
        <RecipeInput name="title" label="title" required />
        <RecipeInput type={Textarea} name="description" label="Description" />

        {/* <div class="meta">
        <span class="price">$1200</span>
        <span class="stay">1 Month</span>
      </div> */}

        <DragDropContext onDragEnd={onDragEnd}>
          <Header as={"h3"}>Method</Header>
          <EditSteps />
        </DragDropContext>
        <Button
          className={
            (isLoading ? "loading " : "") +
            (canSave ? "" : "disabled ") +
            "primary"
          }
          type="submit"
        >
          Save
        </Button>
      </Form>
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
      <Header as="h1" textAlign="center">
        {isNew ? "New" : "Edit"} Recipe
      </Header>
      <ErrorSummary />
      {renderContent()}
    </div>
  );
};

export default RecipeAddEdit;
