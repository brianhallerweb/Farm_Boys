import QueryContainer from "./queryContainer";
import "../styles/sideNavContainer.css";
import React from "react";

const SideNavContainer = props => (
  <div className="sideNavContainer">
    <div>
      <div>
        <QueryContainer query={props.query} />
      </div>
    </div>
  </div>
);

export default SideNavContainer;
