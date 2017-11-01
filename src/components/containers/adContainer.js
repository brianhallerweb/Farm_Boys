import { Link } from "react-router-dom";
import "../styles/adContainer.css";
import React, { Component } from "react";
import AdModalContainer from "./adModalContainer";
import { Table } from "react-bootstrap";

export default class AdContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { modal: "" };
    this.resetModal = this.resetModal.bind(this);
  }

  resetModal() {
    this.setState({ modal: "" });
  }

  render() {
    return (
      <div className="adList">
        <Table hover responsive>
          <tbody>
            {this.props.ads.map(ad => (
              <tr
                onClick={() =>
                  this.setState({
                    modal: (
                      <AdModalContainer resetModal={this.resetModal} ad={ad} />
                    )
                  })}
              >
                <td>{ad.title}</td>
                <td>${ad.price}</td>
                <td>{ad.date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        {this.state.modal}
      </div>
    );
  }
}
