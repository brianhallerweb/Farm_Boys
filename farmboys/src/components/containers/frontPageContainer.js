import React, { Component } from "react";
import "../styles/frontPageContainer.css";
import SideNavContainer from "./sideNavContainer.js";
import AdContainer from "./adContainer.js";
import QueryContainer from "./queryContainer";
import { Link } from "react-router-dom";
import ModalContainer from "./modalContainer.js";

export default class FrontPageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      loginModal: false,
      user: {}
    };
    this.resetModal = this.resetModal.bind(this);
  }

  resetModal() {
    this.setState({ loginModal: false });
  }

  componentWillMount() {
    this.updateAds();
  }

  updateAds = () =>
    fetch("/farm_boys/ads")
      .then(response => response.json())
      .then(ads => this.setState({ ads }));

  loggedInUser = user => {
    this.setState({ user: user });
  };

  query = queryState =>
    fetch("/farm_boys/ads")
      .then(response => response.json())
      .then(ads => this.setState({ ads }));

  render() {
    let modalContainer = <div />;
    if (this.state.loginModal) {
      modalContainer = <ModalContainer resetModal={this.resetModal} />;
    }
    return (
      <div className="frontPageContainer">
        <h1>Garden City Market</h1>
        <h1>{this.state.user.username}</h1>
        <SideNavContainer loggedInUser={this.loggedInUser} query={this.query} />

        <Link to="/create_ad">
          <button>Make Ad</button>
        </Link>
        {modalContainer}
        <button
          onClick={() => this.setState({ loginModal: !this.state.loginModal })}
        >
          Login
        </button>
        <AdContainer ads={this.state.ads} />
      </div>
    );
  }
}
