import { compose, combineReducers, applyMiddleware, createStore } from "redux";
import reduxThunk from "redux-thunk";

import authReducer from "./auth/state/authReducers";
import recipeReducer from "./recipe/state/recipeReducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reducers = combineReducers({
  auth: authReducer,
  recipes: recipeReducer,
});

const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(reduxThunk))
);

export default store;
