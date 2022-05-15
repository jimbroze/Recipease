import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Container } from "semantic-ui-react";

import Header from "./common/Header";
import RecipeList from "./recipe-list/RecipeList";
import RecipeShow from "./recipe/RecipeShow";
import RecipeAddEdit from "./recipe/RecipeAddEdit";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipes/:recipeId" element={<RecipeShow />} />
          <Route path="/recipes/:recipeId/edit" element={<RecipeAddEdit />} />
          <Route path="/recipes/new" element={<RecipeAddEdit />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;
