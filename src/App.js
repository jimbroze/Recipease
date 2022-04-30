import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./common/Header";
import ErrorSummary from "./error/ErrorSummary";
import RecipeList from "./recipe-list/RecipeList";
import RecipeShow from "./recipe/RecipeShow";
import RecipeAddEdit from "./recipe/RecipeAddEdit";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <div className="ui container">
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipes/:recipeId" element={<RecipeShow />} />
          <Route path="/recipes/:recipeId/edit" element={<RecipeAddEdit />} />
          <Route path="/recipes/new" element={<RecipeAddEdit />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;

// let navigate = useNavigate();
// navigate("/logout");
