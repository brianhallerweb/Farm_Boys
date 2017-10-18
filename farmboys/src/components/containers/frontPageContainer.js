import React, { Component } from "react";
import "../styles/frontPageContainer.css";
import SideNavContainer from "./sideNavContainer.js";
import AdContainer from "./adContainer.js";
import QueryContainer from "./queryContainer";
import { Link } from "react-router-dom";

export default class FrontPageContainer extends Component {
  state = {
    ads: [],
    user: {}
  };

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
    return (
      <div className="frontPageContainer">
        <h1>Garden City Market</h1>
        <h1>{this.state.user.username}</h1>
        <SideNavContainer loggedInUser={this.loggedInUser} query={this.query} />
        <div style={{ float: "right", width: "73%" }}>
          <Link to="/create_ad">
            <button>Make Ad</button>
          </Link>
          <AdContainer ads={this.state.ads} />
        </div>
      </div>
    );
  }
}
