import React, { Component } from "react";
import LoginContainer from "./loginContainer";
import "../styles/sideNavContainer.css";

export default class SideNavContainer extends Component {
  render() {
    return (
      <div className="sideNavContainer">
        <div>
          <div>
            <LoginContainer />
          </div>
          <div>
            <LoginContainer />
          </div>
          <div>
            <LoginContainer />
          </div>
        </div>
      </div>
    );
  }
}
