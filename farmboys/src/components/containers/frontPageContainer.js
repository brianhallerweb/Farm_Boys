import React, { Component } from "react";
import "../styles/frontPageContainer.css";
import SideNavContainer from "./sideNavContainer.js";
import AdContainer from "./adContainer.js";
import NewPostModalContainer from "./newPostModalContainer";
import { Link } from "react-router-dom";
import LoginButton from "./LoginButton.js";
import { read_cookie, delete_cookie } from "sfcookies";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";

export default class FrontPageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      loginModal: false,
      adModal: false,
      user: undefined
    };
  }

  fetchUser = () => {
    fetch("/api/farm_boys/users", {
      headers: {
        authorization: read_cookie("userKey")
      }
    })
      .then(response => response.json())
      .then(user => {
        if (user.email) {
          this.setState({ user: user });
        }
      });
  };

  toggleLoginModal = () => {
    this.setState({ loginModal: !this.state.loginModal });
  };

  resetAdModal = () => {
    this.setState({ adModal: false });
  };

  componentDidMount() {
    this.updateAds();
    this.fetchUser(this);
  }

  clickProfile = e => {
    if (!this.state.user) {
      e.preventDefault();
      this.setState({ loginModal: true });
    }
  };

  clickAddAd = e => {
    if (!this.state.user) {
      this.setState({ loginModal: true });
    } else {
      this.setState({ adModal: true });
    }
  };

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
    let greeting = "";
    if (this.state.user) {
      greeting = (
        <h2 style={{ float: "right", margin: "50px", marginLeft: "-50%" }}>
          Welcome,{" "}
          <Link to={`/my_profile/${this.state.user && this.state.user._id}`}>
            {this.state.user.username}
          </Link>
        </h2>
      );
    }
    return (
      <div className="frontPageContainer">
        {greeting}
        <h1>Garden City Market</h1>
        <SideNavContainer loggedInUser={this.loggedInUser} query={this.query} />
        <button onClick={this.clickAddAd}>Make Ad</button>
        {this.state.adModal ? (
          <NewPostModalContainer
            resetModal={this.resetAdModal}
            updateAds={this.updateAds}
            user={this.state.user}
            {...this.props}
          />
        ) : (
          ""
        )}
        {this.state.user ? (
          <button
            onClick={() => {
              delete_cookie("userKey");
              this.setState({ user: undefined });
            }}
          >
            Logout
          </button>
        ) : (
          <LoginButton
            resetModal={this.toggleLoginModal}
            display={this.state.loginModal}
            fetchUser={this.fetchUser}
          />
        )}
        <Link
          onClick={this.clickProfile}
          to={`/my_profile/${this.state.user && this.state.user._id}`}
        >
          <button>My Account</button>
        </Link>
        <AdContainer ads={this.state.ads} />
      </div>
    );
  }
}
