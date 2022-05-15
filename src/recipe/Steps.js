import React from "react";
import { useSelector } from "react-redux";

import { stepsSelectors } from "./currentRecipeSlice";
import Step from "./Step";

const Method = (props) => {
  const stepsIds = useSelector((state) => stepsSelectors.selectIds(state));

  return (
    <>
      <div className="items">
        {stepsIds.map((stepId, index) => (
          <Step key={stepId} id={stepId} index={index} />
        ))}
      </div>
    </>
  );
};

export default Method;
