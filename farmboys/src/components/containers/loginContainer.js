import React, { Component } from "react";
import "../styles/loginContainer.css";
import { Link } from "react-router-dom";
import { bake_cookie, read_cookie, delete_cookie } from "sfcookies";
import "whatwg-fetch";

let base64 = require("base-64");

export default class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  validateLogin(input) {
    console.log("validateLogin has run");
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
          console.log("Success!", returnedObject.token);
        } else {
          console.log("Bummer dude!");
        }
      });
  }

  render() {
    return (
      <div className="loginContainer">
        <div>
          <div className="userName">
            <div>Username</div>
            <div>
              <input
                onChange={e => this.setState({ username: e.target.value })}
                type="text"
              />
            </div>
            <div>Password</div>
            <div>
              <input
                onChange={e => this.setState({ password: e.target.value })}
                type="password"
              />
            </div>
          </div>

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
          <Link to="/signUp">Sign Up!</Link>
        </div>
      </div>
    );
  }
}
