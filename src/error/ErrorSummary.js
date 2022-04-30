import React from "react";
import { useSelector } from "react-redux";

import { errorSelectors } from "./errorSlice";

const ErrorSummary = (props) => {
  const errorIds = useSelector((state) => {
    if (props.errorIds) {
      return props.errorIds;
    }
    return errorSelectors.selectIds(state);
  });

  if (Object.keys(errorIds).length === 0) {
    return null;
  }

  const Error = ({ errorId }) => {
    const error = useSelector((state) =>
      errorSelectors.selectById(state, errorId)
    );
    return <li>{error?.message}</li>;
  };

  return (
    <div className="ui error message">
      <div className="header">
        Error{Object.keys(errorIds).length > 1 ? "s" : ""}
      </div>
      <ul className="list">
        {errorIds.map((errorId) => (
          <Error errorId={errorId} key={errorId} />
        ))}
      </ul>
    </div>
  );
};

export default ErrorSummary;
