import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import "../styles/adModalContainer.css";
import { Link } from "react-router-dom";
import draftToHtml from "draftjs-to-html";

export default class AdModalContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { showModal: true };
  }

  render() {
    return (
      <div className="modal">
        <Modal
          show={this.state.showModal}
          onHide={() => {
            this.setState({ showModal: false });
            this.props.resetModal();
          }}
        >
          <Modal.Header closeButton />
          <Modal.Body>
            <div className="modalBody">
              <div>
                <h1>{this.props.ad.title}</h1>
              </div>
              <div>
                <h2>{this.props.ad.image}</h2>
              </div>
              <div>
                <h2>Posted By: {this.props.ad.username}</h2>
              </div>
              <div>
                <h2>Produce type: {this.props.ad.type}</h2>
              </div>
              <div>
                <h2>
                  Description:{" "}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: draftToHtml(this.props.ad.description)
                    }}
                  />
                </h2>
              </div>
              <div>
                <h2>Price: {this.props.ad.price}</h2>
              </div>
              <div>
                <h2>Date Posted: {this.props.ad.date}</h2>
              </div>
            </div>
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
  }
}
