import React from "react";

const ErrorSummary = (props) => {
  if (Object.keys(props.errors).length === 0) {
    return null;
  }

  return (
    <div className="ui error message">
      <div className="header">Errors</div>
      <ul className="list">
        {Object.keys(props.errors).map((error) => (
          <li key={error}>{props.errors[error]?.message}</li>
        ))}
        {console.log(props.errors)}
      </ul>
    </div>
  );
};

export default ErrorSummary;
