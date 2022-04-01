import React from "react";
import { Form, Field } from "react-final-form";
import { DragDropContext } from "react-beautiful-dnd";

const Recipe = (props) => {
  const onSubmit = (formValues) => {
    props.onSubmit(formValues);
  };

  const validate = (formValues) => {
    const errors = {};

    if (!formValues.title) {
      errors.title = "Please give your recipe a title";
    }

    if (!formValues.description) {
      errors.description = "Please give your recipe a description";
    }

    return errors;
  };

  const renderError = ({ error, touched }) => {
    if (touched && error) {
      return (
        <div className="ui error message">
          <div className="header">{error}</div>
        </div>
      );
    }
  };

  const renderInput = ({ input, label, meta }) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div className={className}>
        <label>{label}</label>
        <input {...input} autoComplete="off" />
        {renderError(meta)}
      </div>
    );
  };

  const renderForm = ({ handleSubmit }) => {
    <form onSubmit={handleSubmit} className="ui form error">
      <Field name="title" component={renderInput} label="Enter a Title" />
      <Field
        name="description"
        component={renderInput}
        label="Enter a Description"
      />
      <button className="ui button primary">Submit</button>
    </form>;
  };

  return (
    <Form
      initialValues={props.initialValues}
      onSubmit={onSubmit}
      validate={validate}
      render={renderForm}
    />
  );
};

export default Recipe;
