import React from "react";
import { useSelector } from "react-redux";
import { Droppable, Draggable } from "react-beautiful-dnd";

import { stepsSelectors, stepActions } from "./currentRecipeSlice";
import MakeEditable from "./MakeEditable";
import EditIngredients from "./EditIngredients";
import Instruction from "./Instruction";

const RecipeMethod = (props) => {
  const stepsIds = useSelector((state) => stepsSelectors.selectIds(state));

  const EditableInstruction = MakeEditable(
    Instruction,
    stepsSelectors,
    stepActions,
    "Add an instruction.",
    "textarea",
    { rows: 1 }
  );

  const renderDragHandle = (dragHandleProps) => {
    // if (!props.isEditable || props.isEditing) return;
    return (
      // <div className="">
      <i
        {...dragHandleProps}
        className="middle aligned arrows alternate icon large"
      ></i>
      // </div>
    );
  };

  return (
    <>
      <Droppable droppableId="Method" type="steps">
        {(provided) => (
          <div
            className="items"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {stepsIds.map((stepId, index) => (
              <Draggable
                draggableId={`${stepId}`}
                index={index}
                key={`${stepId}`}
                type="steps"
              >
                {(provided) => (
                  <div
                    key={stepId}
                    className="item"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    {renderDragHandle(provided.dragHandleProps)}
                    <div className="content">
                      <div className="ui segment">
                        <div className="header">Step {index + 1}</div>
                        <div className="ui equal width grid">
                          <div className="column">
                            <EditIngredients stepId={stepId} />
                          </div>
                          <div className="column">
                            <EditableInstruction id={stepId} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <EditableInstruction />
      {/* <EditIngredients /> */}
    </>
  );
};

export default RecipeMethod;
