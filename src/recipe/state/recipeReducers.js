import _ from "lodash";
import {
  RECIPE_CREATED,
  RECIPES_LOADED,
  RECIPE_LOADED,
  RECIPE_EDITED,
  RECIPE_DELETED,
} from "./recipeActionTypes";

export default (state = {}, action) => {
  switch (action.type) {
    case RECIPE_CREATED:
      // es2015 key interpolation
      return { ...state, [action.payload.id]: action.payload };
    case RECIPES_LOADED:
      return { ...state, ..._.mapKeys(action.payload, "id") };
    case RECIPE_LOADED:
      return { ...state, [action.payload.id]: action.payload };
    case RECIPE_EDITED:
      return { ...state, [action.payload.id]: action.payload };
    case RECIPE_DELETED:
      return _.omit(state, action.payload);
    default:
      return state;
  }
};
