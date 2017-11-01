import React, { Component } from "react";
import "../styles/frontPageContainer.css";
import SideNavContainer from "./sideNavContainer.js";
import AdContainer from "./adContainer.js";
import NewPostModalContainer from "./newPostModalContainer";
import LoginButton from "./LoginButton.js";
import { Link } from "react-router-dom";
import { read_cookie, delete_cookie } from "sfcookies";
import { Button } from "react-bootstrap";
export default class FrontPageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      queryString: "",
      loginModal: false,
      adModal: false,
      user: undefined,
      activePage: 0
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

  handlePagination(eventKey) {
    this.state.activePage = eventKey;
    this.updateAds();
  }

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

  updateAds = queryString => {
    let updateState = {};
    if (queryString !== undefined) {
      updateState = { queryString, activePage: 0 };
    }
    this.setState(updateState, () => {
      const page = Math.max(this.state.activePage - 1, 0);
      fetch(`/farm_boys/ads?page=${page}&${this.state.queryString}`)
        .then(response => response.json())
        .then(ads => {
          console.log(ads);
          this.setState({ ads: ads.result, adCount: ads.count });
        });
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
          <Button onClick={this.clickAddAd}>Make Ad</Button>
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
            query={this.updateAds}
          />
        </div>
        <div className="adContainer">
          <AdContainer
            adCount={this.state.adCount}
            ads={this.state.ads}
            handlePagination={this.handlePagination.bind(this)}
            activePage={this.state.activePage}
          />
        </div>
      </div>
    );
  }
}
