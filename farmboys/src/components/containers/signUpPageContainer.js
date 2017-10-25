import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/signUpPageContainer.css";
import "whatwg-fetch";

export default class SignUpPageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      phonenumber: "",
      password: "",
      email: "",
      passwordConfirm: "",
      admin: false
    };
  }

  createUser() {
    fetch("/farm_boys/users", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state)
    }).then(function(response) {
      return response.json();
    });
  }

  render() {
    if (this.state.password === this.state.passwordConfirm) {
      var style = {
        color: "#000000"
      };
    } else {
      var style = {
        color: "#ff0000"
      };
    }
    return (
      <div className="signUpPageContainer">
        <div>
          <input
            onChange={e => this.setState({ username: e.target.value })}
            type="text"
            placeholder="username"
          />
        </div>
        <div>
          <input
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="email"
          />
        </div>
        <div>
          <input
            onChange={e => this.setState({ phonenumber: e.target.value })}
            type="text"
            placeholder="phonenumber"
          />
        </div>
        <div>
          <input
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="password"
          />
        </div>
        <div>
          <input
            onChange={e => this.setState({ passwordConfirm: e.target.value })}
            type="password"
            placeholder="Confirm Password"
            style={style}
          />
        </div>
        <button onClick={this.createUser.bind(this)}>Create Account</button>
      </div>
    );
  }
}
