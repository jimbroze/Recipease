import React from "react";

const Ingredient = (props) => {
  // const draggableProps = props.draggableProps || { style: "" };
  const ingredientText = (props.ingredient || { text: "" }).text;

  const renderDragHandle = () => {
    if (!props.isEditable || props.isEditing) return;
    return (
      <i
        {...props.dragHandleProps}
        className="middle aligned arrows alternate icon large"
      ></i>
    );
  };

  const renderCloseButton = () => {
    if (!props.isEditable || props.isEditing) return;
    return (
      <div
        className="right floated content"
        style={{ marginLeft: "auto", order: "2" }}
      >
        <div
          className="ui tiny negative basic icon button"
          onClick={() => props.onRemove()}
        >
          <i className="close icon"></i>
        </div>
      </div>
    );
  };

  const ingredientContent = props.children || (
    <p className="header" onClick={props.onClick}>
      {ingredientText}
    </p>
  );

  // For mini ingredients on steps try labels:
  // <div class="extra">
  //       <div class="ui label">IMAX</div>
  //       <div class="ui label"><i class="globe icon"></i> Additional Languages</div>
  //     </div>

  return (
    <div
      className="item"
      ref={props.innerRef}
      {...props.draggableProps}
      style={{
        display: "flex",
        alignItems: "center",
        ...props.draggableProps?.style,
      }}
    >
      {renderCloseButton()}
      {renderDragHandle()}
      <div className="content">{ingredientContent}</div>
    </div>
  );
};

export default Ingredient;
