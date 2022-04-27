import React from "react";

const LoadingSpinner = (props) => {
  return (
    <div className="ui segment" style={{ height: "100px" }}>
      <div className={"ui active " + (props.text ? "text " : "") + "loader"}>
        {props.text}
      </div>
    </div>
  );
};

export default LoadingSpinner;
