import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import LoginContainer from "./loginContainer.js";
import "../styles/modalContainer.css";

export default class LoginButton extends Component {
  render() {
    return (
      <div>
        <Button onClick={this.props.resetModal}>Login</Button>
        {this.props.display ? (
          <div className="modal">
            <p>Click to get the full Modal experience!</p>
            <Button onClick={this.open}>Launch demo modal</Button>
            <Modal
              show={this.props.display}
              onHide={() => {
                this.props.resetModal();
              }}
            >
              <Modal.Header closeButton />
              <Modal.Body>
                <LoginContainer {...this.props} />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={() => {
                    this.props.resetModal();
                  }}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
