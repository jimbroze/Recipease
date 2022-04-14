import { createSlice, createEntityAdapter, current } from "@reduxjs/toolkit";

const sectionsAdapter = createEntityAdapter({});
const stepsAdapter = createEntityAdapter({});
const ingredientsAdapter = createEntityAdapter({
  // selectId: (ingredient) => ingredient.id,
});

// const initialState = {
//   meta: {
//     title: "",
//     description: "",
//   },
//   ingredients: {
//     byId: {},
//     allIds: [],
//     nextId: 1,
//   },
//   sections: {
//     byId: {
//       1: {
//         id: 1,
//         ingredients: [],
//       },
//     },
//     allIds: [1],
//     nextId: 2,
//   },
// };

const initialState = {
  title: "",
  description: "",
  sections: sectionsAdapter.getInitialState(),
  steps: stepsAdapter.getInitialState({
    ids: [1],
    entities: { 1: { id: 1, ingredients: [] } },
  }),
  ingredients: ingredientsAdapter.getInitialState(),
  nextId: 2,
};

const currentRecipeSlice = createSlice({
  name: "currentRecipe",
  initialState,
  reducers: {
    setCurrentRecipe(state, action) {
      //TODO is this needed?
      state = action.payload;
    },
    ingredientAdded(state, action) {
      const { ingredient, stepId } = action.payload;
      const nextId = state.nextId;

      ingredientsAdapter.addOne(state.ingredients, {
        id: nextId,
        ...ingredient,
      });

      if (stepId) {
        state.steps.entities[stepId].ingredients.push(nextId);
      }
      state.nextId = nextId + 1;
    },
    ingredientUpdated(state, action) {
      ingredientsAdapter.upsertOne(state.ingredients, action.payload);
    },
    ingredientRemoved(state, action) {
      const { ingredientId, stepId } = action.payload;

      ingredientsAdapter.removeOne(state.ingredients, ingredientId);

      if (stepId) {
        const ingredientIndex =
          state.steps.entities[stepId].ingredients.indexOf(ingredientId);
        state.steps.entities[stepId].ingredients.splice(ingredientIndex, 1);
      }
    },
    ingredientsMoved(state, action) {
      const { destStep, sourceStep, ingredientId } = action.payload;
      // TODO currently only works with one list

      const step = state.steps.entities[sourceStep.droppableId];
      const newIngredientsList = Array.from(step.ingredients);
      // Remove from list then add back in.
      newIngredientsList.splice(sourceStep.index, 1);
      newIngredientsList.splice(destStep.index, 0, ingredientId);

      state.steps.entities[sourceStep.droppableId].ingredients =
        newIngredientsList;
    },
  },
});

export const {
  setCurrentRecipe,
  ingredientAdded,
  ingredientUpdated,
  ingredientRemoved,
  ingredientsMoved,
  setUpdateStatus,
} = currentRecipeSlice.actions;

export default currentRecipeSlice.reducer;

export const stepsSelectors = ingredientsAdapter.getSelectors(
  (state) => state.currentRecipe.steps
);
export const ingredientsSelectors = ingredientsAdapter.getSelectors(
  (state) => state.currentRecipe.ingredients
);
