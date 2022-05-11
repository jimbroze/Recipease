import React from "react";
// import { useSelector } from "react-redux";

// import { stepsSelectors } from "./currentRecipeSlice";

const Instruction = ({ children, onClick, id, text }) => {
  // const step = useSelector((state) => stepsSelectors.selectById(state, id));

  // const instructionText = (step || { text: "" }).text;

  const instructionContent = children || (
    <div className="header">
      <p onClick={onClick}>{text}</p>
    </div>
  );

  return <div>{instructionContent}</div>;
};

export default Instruction;
