import React from "react";
import { useSelector } from "react-redux";

import { stepsSelectors } from "./currentRecipeSlice";

const Instruction = (props) => {
  const step = useSelector((state) =>
    stepsSelectors.selectById(state, props.stepId)
  );

  return (
    <div>
      <p>{step.instruction}</p>
    </div>
  );
};

export default Instruction;
