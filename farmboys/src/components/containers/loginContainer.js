import React, { Component } from "react";
import "../styles/loginContainer.css";
import { Link } from "react-router-dom";
import { bake_cookie, read_cookie, delete_cookie } from "sfcookies";
import "whatwg-fetch";
import SignUpModalContainer from "./signUpModalContainer";

let base64 = require("base-64");

export default class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      signUpModal: false
    };
  }

  validateLogin(input) {
    return fetch("/authenticate", {
      method: "post",
      headers: {
        authorization:
          "Basic " + base64.encode(input.username + ":" + input.password),
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(returnedObject => {
        if (returnedObject.success) {
          bake_cookie("userKey", returnedObject.token);
          this.props.resetModal();
          this.props.fetchUser();
        } else {
          alert("Invalid username or password");
        }
      });
  }

  signUpToggle = () => {
    this.setState({ signUpModal: !this.state.signUpModal });
  };

  render() {
    return (
      <div className="loginContainer">
        <div>
          <div className="userName">
            <div style={{ margin: "10px" }}>Username</div>
            <div>
              <input
                onChange={e => this.setState({ username: e.target.value })}
                type="text"
              />
            </div>
            <div style={{ margin: "10px" }}>Password</div>
            <div style={{ margin: "10px" }}>
              <input
                onChange={e => this.setState({ password: e.target.value })}
                type="password"
              />
            </div>
            <div style={{ margin: "10px" }}>
              <button
                onClick={e => {
                  this.validateLogin({
                    username: this.state.username,
                    password: this.state.password
                  });
                }}
              >
                Login
              </button>
            </div>
            <div style={{ margin: "10px" }}>
              <button onClick={() => this.signUpToggle()}>Sign Up!</button>
            </div>
            {this.state.signUpModal ? <SignUpModalContainer /> : ""}
          </div>
        </div>
      </div>
    );
  }
}
