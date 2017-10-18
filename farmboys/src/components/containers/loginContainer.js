import React, { Component } from "react";
import "../styles/loginContainer.css";
import { Link } from "react-router-dom";
import "whatwg-fetch";

export default class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  render() {
    return (
      <div className="loginContainer">
        <div>
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
              type="text"
            />
          </div>
          {/* TO DO ----OnClick for button------------------- */}
          <button
            onClick={e => {
              fetch("/farm_boys/users")
                .then(response => response.json())
                .then(users => {
                  users.forEach(index => {
                    if (
                      this.state.username === index.username &&
                      this.state.password === index.password
                    ) {
                      this.props.loggedInUser(index);
                    }
                  });
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
