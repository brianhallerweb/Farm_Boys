import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import LoginContainer from "./loginContainer.js";
import "../styles/modalContainer.css";

export default class ModalContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { showModal: true };
  }

  // open() {
  //
  //   this.setState({ showModal: true });
  // }

  render() {
    if (this.state.showModal) {
      return (
        <div className="modal">
          <p>Click to get the full Modal experience!</p>
          <Button onClick={this.open}>Launch demo modal</Button>
          <Modal
            show={this.state.showModal}
            onHide={() => {
              this.setState({ showModal: false });
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
                  this.setState({ showModal: false });
                  this.props.resetModal();
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    } else {
      return <div />;
    }
  }
}
