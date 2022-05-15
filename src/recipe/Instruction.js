import React from "react";
import { Header } from "semantic-ui-react";

const Instruction = ({ altContent, onClick, text }) => {
  const instructionContent = altContent || <p onClick={onClick}>{text}</p>;

  return <div>{instructionContent}</div>;
};

export default Instruction;
