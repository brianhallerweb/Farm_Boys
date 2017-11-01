import React, { Component } from "react";
import "../styles/frontPageContainer.css";
import SideNavContainer from "./sideNavContainer.js";
import AdContainer from "./adContainer.js";
import NewPostModalContainer from "./newPostModalContainer";
import LoginButton from "./LoginButton.js";
import { Link } from "react-router-dom";
import { read_cookie, delete_cookie } from "sfcookies";
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Button
} from "react-bootstrap";
import _ from "lodash";
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
        if (user._id) {
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
    this.fetchUser();
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
    fetch("/farm_boys/ads/?page=1")
      .then(response => response.json())
      .then(ads => this.setState({ ads }));

  query = queryString => {
    fetch("/farm_boys/ads/" + queryString)
      .then(response => response.json())
      .then(ads => {
        if (ads.length === 0) {
          alert("Your search did not match any results.");
        } else {
          this.setState({ ads });
        }
      });
  };

  render() {
    let greeting = "";
    if (this.state.user) {
      greeting = <h5>Welcome, {this.state.user.username}</h5>;
    }
    return (
      <div class="grid">
        <div class="title">
          {greeting}
          <Button onClick={this.clickAddAd}>Make Add</Button>
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
            <Button
              onClick={() => {
                delete_cookie("userKey");
                this.setState({ user: undefined });
              }}
            >
              Logout
            </Button>
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
            <Button>My Account</Button>
          </Link>
        </div>
        <div className="header">
          <h1>Garden City Market</h1>
        </div>
        <div className="sidebar">
          <SideNavContainer
            loggedInUser={this.loggedInUser}
            query={this.query}
          />
        </div>
        <div className="adContainer">
          <AdContainer ads={this.state.ads} />
        </div>
      </div>
    );
  }
}
