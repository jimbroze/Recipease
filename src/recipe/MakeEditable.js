import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "semantic-ui-react";

const MakeEditable = (
  WrappedComponent,
  entitySelector,
  entityActions,
  placeholder,
  InputType,
  inputProps
) => {
  // function getDisplayName(WrappedComponent) {
  //   return WrappedComponent.displayName || WrappedComponent.name || "Component";
  // }

  return function WithWrapper(props) {
    const dispatch = useDispatch();

    const entity = useSelector((state) =>
      entitySelector.selectById(state, props.id)
    );

    const isNew = !props.id;
    const [text, setText] = useState((entity || { text: "" }).text);
    const [isEditing, setIsEditing] = useState(isNew);

    const { addAction, updateAction, removeAction } = entityActions;

    // const componentName = getDisplayName(WrappedComponent).toLowerCase();

    const InputComp = InputType || "input";

    const removeEntity = () => {
      dispatch(removeAction(props.id, props.containerId));
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
        dispatch(addAction({ text }, props.containerId));
        setText("");
      } else {
        dispatch(updateAction({ id: props.id, text }));
        setIsEditing(false);
      }
    };

    const onClick = () => {
      setIsEditing(true);
    };

    const renderAltContent = () => {
      if (!isEditing) return;
      return (
        <Form.Field>
          <InputComp
            placeholder={placeholder}
            onChange={onChange}
            onKeyPress={onEnter}
            onBlur={onBlur}
            autoFocus={!isNew}
            value={text}
            {...inputProps}
          />
        </Form.Field>
      );
    };
    return (
      <div style={{ cursor: "pointer", display: "contents" }}>
        <WrappedComponent
          {...props}
          // {...{ [componentName]: entity }} // No longer required
          onRemove={removeEntity}
          onClick={onClick}
          isEditable={true}
          isEditing={isEditing}
          altContent={renderAltContent()}
        />
      </div>
    );
  };
};

export default MakeEditable;
