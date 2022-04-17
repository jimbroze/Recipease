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
    ids: ["step1"],
    entities: { step1: { id: "step1", ingredients: [] } },
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
    ingredientAdded: {
      reducer(state, action) {
        const { ingredient, stepId } = action.payload;
        const ingredientId = `ingredient${state.nextId}`;

        ingredientsAdapter.addOne(state.ingredients, {
          id: ingredientId,
          ...ingredient,
        });

        if (stepId) {
          state.steps.entities[stepId].ingredients.push(ingredientId);
        }
        state.nextId++;
      },
      prepare(ingredient, stepId) {
        return { payload: { ingredient, stepId } };
      },
    },
    ingredientUpdated(state, action) {
      ingredientsAdapter.upsertOne(state.ingredients, action.payload);
    },
    ingredientRemoved: {
      reducer(state, action) {
        const { ingredientId, stepId } = action.payload;

        ingredientsAdapter.removeOne(state.ingredients, ingredientId);

        if (stepId) {
          const ingredientIndex =
            state.steps.entities[stepId].ingredients.indexOf(ingredientId);
          state.steps.entities[stepId].ingredients.splice(ingredientIndex, 1);
        }
      },
      prepare(ingredientId, stepId) {
        return { payload: { ingredientId, stepId } };
      },
    },
    ingredientsMoved(state, action) {
      const { destStep, sourceStep, ingredientId } = action.payload;
      // TODO currently only works with one list and only with ingredients.

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
export const ingredientActions = {
  addAction: ingredientAdded,
  updateAction: ingredientUpdated,
  removeAction: ingredientRemoved,
};

export default currentRecipeSlice.reducer;

export const stepsSelectors = stepsAdapter.getSelectors(
  (state) => state.currentRecipe.steps
);
export const ingredientsSelectors = ingredientsAdapter.getSelectors(
  (state) => state.currentRecipe.ingredients
);
