import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import "../styles/adModalContainer.css";
import draftToHtml from "draftjs-to-html";
import { Panel } from "react-bootstrap";

export default class AdModalContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { showModal: true };
  }

  render() {
    return (
      <div className="modal">
        <Modal
          dialogClassName="adModal"
          show={this.state.showModal}
          onHide={() => {
            this.setState({ showModal: false });
            this.props.resetModal();
          }}
        >
          <Modal.Body>
            <div className="modalBody">
              <p className="date">Date Posted: {this.props.ad.date}</p>

              <Panel header={this.props.ad.title} bsStyle="success">
                <ul>
                  <li>
                    Description:{" "}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: draftToHtml(this.props.ad.description)
                      }}
                    />
                  </li>
                  <li>Price: ${this.props.ad.price}</li>
                  <li>Contact: {this.props.ad.contact}</li>
                </ul>
              </Panel>
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
