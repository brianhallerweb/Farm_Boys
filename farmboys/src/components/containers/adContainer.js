import { Link } from "react-router-dom";
import "../styles/adContainer.css";
import React, { Component } from "react";
import AdModalContainer from "./adModalContainer";

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
      <div className="adContainer">
        <ul>
          {this.props.ads.map(ad => (
            <li>
              <h3>{ad.title}</h3>
              <button
                onClick={() =>
                  this.setState({
                    modal: (
                      <AdModalContainer resetModal={this.resetModal} ad={ad} />
                    )
                  })}
              >
                View Listing
              </button>
            </li>
          ))}
        </ul>
        {this.state.modal}
      </div>
    );
  }
}
