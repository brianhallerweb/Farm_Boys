import React, { Component } from "react";
import "../styles/frontPageContainer.css";
import SideNavContainer from "./sideNavContainer.js";
import AdContainer from "./adContainer.js";
import SearchContainer from "./searchContainer";

export default class FrontPageContainer extends Component {
  render() {
    return (
      <div className="frontPageContainer">
        <SideNavContainer />
        <div style={{ float: "right", width: "73.5%" }}>
          <SearchContainer />
          <AdContainer />
        </div>
      </div>
    );
  }
}
