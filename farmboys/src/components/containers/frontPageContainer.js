import React, { Component } from "react";
import "../styles/frontPageContainer.css";
import SideNavContainer from "./sideNavContainer.js";
import AdContainer from "./adContainer.js";
import QueryContainer from "./queryContainer";
import { Link } from "react-router-dom";
import ModalContainer from "./modalContainer.js";
import { read_cookie } from "sfcookies";
import { NewPostModalContainer } from "./newPostModalContainer";

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
    let greeting = "";
    let modalContainer = <div />;
    if (this.state.loginModal) {
      modalContainer = <ModalContainer resetModal={this.resetModal} />;
    }
    return (
      <div>
        <ul className="navbar">
          <li>
            <Link to="/create_ad">
              <button>Make Ad</button>
            </Link>
          </li>
          {modalContainer}
          <li>
            <button
              onClick={() =>
                this.setState({ loginModal: !this.state.loginModal })}
            >
              Login
            </button>
          </li>
        </ul>
        <div className="frontPageContainer">
          {greeting}
          <h1>Garden City Market</h1>
          <SideNavContainer
            loggedInUser={this.loggedInUser}
            query={this.query}
          />
          <button onClick={this.clickAddAd}>Make Ad</button>
          {this.state.adModal ? (
            <NewPostModalContainer
              resetModal={this.resetAdModal}
              updateAds={this.updateAds}
              {...this.props}
            />
          ) : (
            ""
          )}
          <LoginButton
            resetModal={this.toggleLoginModal}
            display={this.state.loginModal}
            fetchUser={this.fetchUser}
          />
          <Link
            onClick={this.clickProfile}
            to={`/my_profile/${this.state.user && this.state.user._id}`}
          >
            <button>My Account</button>
          </Link>
          <AdContainer ads={this.state.ads} />
        </div>
      </div>
    );
  }
}
