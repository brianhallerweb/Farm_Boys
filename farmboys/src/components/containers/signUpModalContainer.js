import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/signUpModalContainer.css";
import "whatwg-fetch";
import { Button, Modal } from "react-bootstrap";
import * as EmailValidator from "email-validator";

var phone = require("phone");

export default class SignUpModalContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      phonenumber: "",
      password: "",
      email: "",
      passwordConfirm: "",
      admin: false,
      showModal: true
    };
    console.log(this.props);
  }

  createUser() {
    let username = this.state.username;
    let password = this.state.password;
    let isValid = true;
    if (!EmailValidator.validate(this.state.email)) {
      isValid = false;
      alert("Invalid email address!");
    }
    if (phone(this.state.phonenumber).length > 0) {
      this.state.phonenumber = phone(this.state.phonenumber)
        .shift()
        .concat();
    } else {
      isValid = false;
      alert("Invalid phone number!");
    }
    fetch("/farm_boys/users/?username=" + this.state.username)
      .then(response => response.json())
      .then(user => {
        if (user) {
          isValid = false;
          alert("That username is taken!");
        }
      })
      .then(() => {
        if (isValid) {
          fetch("/farm_boys/users", {
            method: "post",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
          })
            .then(response => response.json())
            .then(() => {
              this.props.validateLogin({ username, password });
              alert("Account creation successful!");
              this.setState({ showModal: false });
            });
        }
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
      <Modal
        show={this.state.showModal}
        onHide={() => {
          this.setState({ showModal: false });
          this.props.resetModal();
        }}
      >
        <Modal.Header closeButton />
        <Modal.Body>
          <div className="signUpModalContainer">
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
                onChange={e =>
                  this.setState({ passwordConfirm: e.target.value })}
                type="password"
                placeholder="Confirm Password"
                style={style}
              />
            </div>
            <button onClick={this.createUser.bind(this)}>Create Account</button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              this.setState({ showModal: false });
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
