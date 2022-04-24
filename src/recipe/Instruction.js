import React from "react";

const Instruction = ({ children, instruction, onClick }) => {
  // const step = useSelector((state) =>
  //   stepsSelectors.selectById(state, props.stepId)
  // );

  const instructionContent = children || (
    <div className="header">
      <p onClick={onClick}>{instruction.text}</p>
    </div>
  );

  return <div>{instructionContent}</div>;
};

export default Instruction;
