import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const MakeEditable = (
  WrappedComponent,
  InputType,
  entitySelector,
  entityActions,
  containerId,
  placeholder
) => {
  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
  }

  return function WithWrapper(props) {
    const dispatch = useDispatch();

    const entity = useSelector((state) =>
      entitySelector.selectById(state, props.id)
    );

    const isNew = !props.id;
    const [text, setText] = useState((entity || { text: "" }).text);
    const [isEditing, setIsEditing] = useState(isNew);

    const { addAction, updateAction, removeAction } = entityActions;

    const componentName = getDisplayName(WrappedComponent).toLowerCase();

    const removeEntity = () => {
      dispatch(removeAction(props.id, containerId));
    };

    const onChange = (event) => {
      setText(event.target.value);
    };

    const onEnter = (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      event.target.blur();
    };

    const onBlur = (event) => {
      if (event.target.value.trim() === "") {
        if (!isNew) {
          removeEntity();
        }
      } else if (isNew) {
        dispatch(addAction({ text }, containerId));
        setText("");
      } else {
        dispatch(updateAction({ id: props.id, text }));
        setIsEditing(false);
      }
    };

    const onClick = () => {
      setIsEditing(true);
    };

    const renderChildren = () => {
      if (!isEditing) return;
      return (
        <div className="field">
          <InputType
            placeholder={placeholder}
            onChange={onChange}
            onKeyPress={onEnter}
            onBlur={onBlur}
            autoFocus={!isNew}
            value={text}
          />
        </div>
      );
    };

    return (
      <WrappedComponent
        {...props}
        {...{ [componentName]: entity }}
        onRemove={removeEntity}
        onClick={onClick}
        isEditable={true}
        isEditing={isEditing}
      >
        {renderChildren()}
      </WrappedComponent>
    );
  };
};

export default MakeEditable;
