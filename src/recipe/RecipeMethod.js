import React from "react";
import { useSelector } from "react-redux";

import { stepsSelectors } from "./currentRecipeSlice";
import Ingredients from "./Ingredients";
import Instruction from "./Instruction";

const RecipeMethod = (props) => {
  const stepsIds = useSelector((state) => stepsSelectors.selectIds(state));

  return (
    <ol>
      {stepsIds.map((stepId) => (
        <li key={stepId}>
          <h4>Ingredients</h4>
          <Ingredients stepId={stepId} />
          <Instruction stepId={stepId} />
        </li>
      ))}
    </ol>
  );
};

export default RecipeMethod;
