import React from "react";

const Ingredient = (props) => {
  const ingredientText = (props.ingredient || { text: "" }).text;

  const renderDragHandle = () => {
    if (!props.isEditable || props.isEditing) return;
    return (
      <i {...props.dragHandleProps} className="arrows alternate icon large"></i>
    );
  };

  const renderCloseButton = () => {
    if (!props.isEditable || props.isEditing) return;
    return (
      <div className="right floated content">
        <div className="ui negative basic icon button">
          <i className="close icon" onClick={() => props.onRemove()}></i>
        </div>
      </div>
    );
  };

  const ingredientContent = props.children || (
    <div className="header">
      <p onClick={props.onClick}>{ingredientText}</p>
    </div>
  );

  return (
    <div className="item" ref={props.innerRef} {...props.draggableProps}>
      {renderDragHandle()}
      <div className="middle aligned content">
        {renderCloseButton()}
        {ingredientContent}
      </div>
    </div>
  );
};

export default Ingredient;
