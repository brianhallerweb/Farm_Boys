import React, { Component } from "react";
import "../styles/frontPageContainer.css";
import SideNavContainer from "./sideNavContainer.js";
import AdContainer from "./adContainer.js";
import QueryContainer from "./queryContainer";

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

  query = queryState =>
    fetch("/farm_boys/ads")
      .then(response => response.json())
      .then(ads => this.setState({ ads }));

  render() {
    return (
      <div className="frontPageContainer">
        <SideNavContainer query={this.query} />
        <div style={{ float: "right", width: "73%" }}>
          <QueryContainer />
          <AdContainer ads={this.state.ads} />
        </div>
      </div>
    );
  }
}
