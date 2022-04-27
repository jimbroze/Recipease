import React from "react";

const ErrorSummary = (props) => {
  if (Object.keys(props.errors).length === 0) {
    return null;
  }

  return (
    <div className="ui error message">
      <div className="header">
        Error{Object.keys(props.errors).length > 1 ? "s" : ""}
      </div>
      <ul className="list">
        {Object.keys(props.errors).map((error) => (
          <li key={error}>{props.errors[error]?.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorSummary;
