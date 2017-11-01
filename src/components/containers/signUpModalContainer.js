import React, { Component } from "react";
import "../styles/signUpModalContainer.css";
import "whatwg-fetch";
import {
  Button,
  Modal,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
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
      showModal: true,
      validPassword: ""
    };
  }

  createUser() {
    let username = this.state.username;
    let password = this.state.password;
    let isValid = true;
    let alertString = "";
    if (!EmailValidator.validate(this.state.email)) {
      isValid = false;
      alertString += "Invalid email address!\n";
    }
    if (phone(this.state.phonenumber).length > 0) {
      this.state.phonenumber = phone(this.state.phonenumber)
        .shift()
        .concat();
    } else {
      isValid = false;
      alertString += "Invalid phone number!\n";
    }
    fetch("/farm_boys/users/?username=" + this.state.username)
      .then(response => response.json())
      .then(user => {
        if (username !== "" && user) {
          isValid = false;
          alertString += "That username is taken!\n";
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
        } else {
          alert(alertString);
        }
      });
  }

  render() {
    return (
      <Modal
        bsSize="small"
        show={this.state.showModal}
        onHide={() => {
          this.setState({ showModal: false });
          this.props.signUpToggle();
        }}
      >
        <Modal.Body>
          <form>
            <FormGroup>
              <ControlLabel>Username</ControlLabel>
              <FormControl
                type="text"
                onChange={e => this.setState({ username: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Email</ControlLabel>

              <FormControl
                onChange={e => this.setState({ email: e.target.value })}
                type="text"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Phone number</ControlLabel>

              <FormControl
                onChange={e => this.setState({ phonenumber: e.target.value })}
                type="text"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Password</ControlLabel>

              <FormControl
                onChange={e => this.setState({ password: e.target.value })}
                type="password"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Confirm password</ControlLabel>

              <FormControl
                onChange={e =>
                  this.setState({
                    passwordConfirm: e.target.value,
                    validPassword: e.target.value
                  })}
                type="password"
              />
            </FormGroup>
            <Button
              bsStyle="primary"
              onClick={e => {
                e.preventDefault();
                this.createUser();
              }}
            >
              Create Account
            </Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              this.setState({ showModal: false });
              this.props.signUpToggle();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
