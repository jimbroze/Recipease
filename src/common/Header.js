import React from "react-dom";
import { Link } from "react-router-dom";
// import GoogleAuth from "./GoogleAuth";

const Header = () => {
  return (
    <div className="ui secondary pointing menu">
      <Link to="/" className="item">
        Recipease
      </Link>
      <div className="right menu">
        <Link to="/" className="item">
          All Recipes
        </Link>
        {/* <GoogleAuth /> */}
      </div>
    </div>
  );
};

export default Header;
