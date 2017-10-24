import React, { Component } from "react";
import "../styles/frontPageContainer.css";
import SideNavContainer from "./sideNavContainer.js";
import AdContainer from "./adContainer.js";
import QueryContainer from "./queryContainer";
import { Link } from "react-router-dom";
import ModalContainer from "./modalContainer.js";
import { read_cookie } from "sfcookies";

export default class FrontPageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      loginModal: false,
      user: []
    };
    this.resetModal = this.resetModal.bind(this);
  }

  fetchUser(self) {
    fetch("/api/farm_boys/users", {
      headers: {
        authorization: read_cookie("userKey")
      }
    })
      .then(response => response.json())
      .then(user => {
        self.setState({ user: user });
        console.log(user);
      });
  }

  resetModal() {
    this.setState({ loginModal: false });
  }

  componentWillMount() {
    this.updateAds();
    this.fetchUser(this);
  }

  updateAds = () =>
    fetch("/farm_boys/ads")
      .then(response => response.json())
      .then(ads => this.setState({ ads }));

  query = queryString => {
    fetch("/farm_boys/ads/" + queryString)
      .then(response => response.json())
      .then(ads => this.setState({ ads }));
  };

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
        <div style={{ float: "right", width: "73%" }}>
          <Link to="/create_ad">
            <button>Make Ad</button>
          </Link>
          {modalContainer}
          <button
            onClick={() =>
              this.setState({ loginModal: !this.state.loginModal })}
          >
            Login
          </button>
          <AdContainer ads={this.state.ads} />
        </div>
      </div>
    );
  }
}
