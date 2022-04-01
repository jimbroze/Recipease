import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./common/Header";
import RecipeList from "./recipe-list/RecipeList";
import Recipe from "./recipe/Recipe";

const App = () => {
  return (
    <div className="ui container">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipe/:id" element={<Recipe />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

// let navigate = useNavigate();
// navigate("/logout");
