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
    this.fetchUser = this.fetchUser.bind(this);
  }

  fetchUser() {
    fetch("/api/farm_boys/users", {
      headers: {
        authorization: read_cookie("userKey")
      }
    })
      .then(response => response.json())
      .then(user => this.setState({ user: user }));
  }

  resetModal() {
    this.setState({ loginModal: false });
  }

  componentDidMount() {
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
    console.log(this.state.user);
    let modalContainer = "";
    let greeting = "";
    if (this.state.loginModal) {
      modalContainer = <ModalContainer resetModal={this.resetModal} />;
    }
    if (this.state.user !== [] && this.state.user.sucess === undefined) {
      greeting = (
        <h2 style={{ float: "right", margin: "50px", marginLeft: "-50%" }}>
          Welcome, {this.state.user.username}
        </h2>
      );
    }
    return (
      <div className="frontPageContainer">
        {greeting}
        <h1>Garden City Market</h1>
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
