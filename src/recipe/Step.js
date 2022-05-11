import React from "react";
import { useSelector } from "react-redux";

import { stepsSelectors } from "./currentRecipeSlice";
import Ingredients from "./Ingredients";
import Instruction from "./Instruction";

const Step = ({ id, index }) => {
  const step = useSelector((state) => stepsSelectors.selectById(state, id));

  return (
    <>
      <div
        key={id}
        className="item"
        // ref={provided.innerRef}
        // {...provided.draggableProps}
      >
        <div className="content">
          <div className="ui segment">
            <div className="header">Step {index + 1}</div>
            <div className="ui equal width grid">
              <div className="column">
                <Ingredients ingredientIds={step.ingredients} stepId={id} />
              </div>
              <div className="column">
                <Instruction text={step.text} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step;
