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
  sections: sectionsAdapter.getInitialState(),
  steps: stepsAdapter.getInitialState(),
  // steps: stepsAdapter.getInitialState({
  //   ids: ["step1"],
  //   entities: { step1: { id: "step1", ingredients: [] } },
  // }),
  ingredients: ingredientsAdapter.getInitialState(),
  nextId: 2,
};

const currentRecipeSlice = createSlice({
  name: "currentRecipe",
  initialState,
  reducers: {
    setCurrentRecipe(state, action) {
      return Object.assign(state, action.payload);
    },
    stepAdded(state, action) {
      const stepId = `step${state.nextId}`;

      stepsAdapter.addOne(state.steps, {
        id: stepId,
        ingredients: [],
        ...action.payload,
      });

      state.nextId++;
    },
    stepUpdated(state, action) {
      stepsAdapter.upsertOne(state.steps, action.payload);
    },
    stepRemoved(state, action) {
      const stepId = action.payload;

      stepsAdapter.removeOne(state.steps, stepId);
    },
    stepsMoved(state, action) {
      const { destination, source, id } = action.payload;

      const stepList = Array.from(state.steps.ids);

      // Remove from list then add back in.
      stepList.splice(source.index, 1);
      stepList.splice(destination.index, 0, id);

      state.steps.ids = stepList;
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
        console.log(stepId);

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
      const { destination, source, id } = action.payload;

      const newSourceList = Array.from(
        state.steps.entities[source.droppableId].ingredients
      );
      var newDestList;

      if (destination.droppableId === source.droppableId) {
        newDestList = newSourceList;
      } else {
        newDestList = Array.from(
          state.steps.entities[destination.droppableId].ingredients
        );
      }

      // Remove from list then add back in.
      newSourceList.splice(source.index, 1);
      newDestList.splice(destination.index, 0, id);

      state.steps.entities[source.droppableId].ingredients = newSourceList;
      state.steps.entities[destination.droppableId].ingredients = newDestList;
    },
  },
});

export const {
  setCurrentRecipe,
  stepAdded,
  stepUpdated,
  stepRemoved,
  stepsMoved,
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
export const stepActions = {
  addAction: stepAdded,
  updateAction: stepUpdated,
  removeAction: stepRemoved,
};

export default currentRecipeSlice.reducer;

export const stepsSelectors = stepsAdapter.getSelectors(
  (state) => state.currentRecipe.steps
);
export const ingredientsSelectors = ingredientsAdapter.getSelectors(
  (state) => state.currentRecipe.ingredients
);
