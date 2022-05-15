import React from "react";
import { useSelector } from "react-redux";
import { Droppable, Draggable } from "react-beautiful-dnd";

import { Icon, Item, Ref } from "semantic-ui-react";
// import Ref from "@semantic-ui-react/component-ref"; Semantic V3 upgrade
import TextareaAutosize from "react-textarea-autosize";

import { stepsSelectors, stepActions } from "./currentRecipeSlice";
import Step from "./Step";
import MakeEditable from "./MakeEditable";
import EditIngredients from "./EditIngredients";
import Instruction from "./Instruction";

const EditSteps = (props) => {
  const stepsIds = useSelector((state) => stepsSelectors.selectIds(state));

  const EditableInstruction = MakeEditable(
    Instruction,
    stepsSelectors,
    stepActions,
    "Add an instruction.",
    TextareaAutosize,
    { rows: 1 }
  );

  const renderDragHandle = (dragHandleProps) => {
    return (
      <Icon
        name="arrows alternate"
        size="large"
        className="middle aligned"
        {...dragHandleProps}
      />
    );
  };

  return (
    <>
      <Droppable droppableId="Method" type="steps">
        {(provided) => (
          <Ref innerRef={provided.innerRef}>
            <Item.Group {...provided.droppableProps}>
              {stepsIds.map((stepId, index) => (
                <Draggable
                  draggableId={`${stepId}`}
                  index={index}
                  key={`${stepId}`}
                  type="steps"
                >
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      {renderDragHandle(provided.dragHandleProps)}
                      <Step
                        key={stepId}
                        id={stepId}
                        index={index}
                        ReplacementIngredient={EditIngredients}
                        ReplacementInstruction={EditableInstruction}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Item.Group>
          </Ref>
        )}
      </Droppable>
      <EditableInstruction />
      {/* <EditIngredients /> */}
    </>
  );
};

export default EditSteps;
