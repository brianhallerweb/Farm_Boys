import React, { Component } from "react";
import "../styles/loginContainer.css";

export default class LoginContainer extends Component {
  render() {
    return (
      <div className="loginContainer">
        <div>
          <div>Username</div>
          <div>
            <input type="text" />
          </div>
          <div>Password</div>
          <div>
            <input type="text" />
          </div>
        </div>
      </div>
    );
  }
}
