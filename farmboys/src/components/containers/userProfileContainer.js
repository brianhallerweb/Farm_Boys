import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/userProfileContainer.css";
import "whatwg-fetch";
import { Editor, EditorState, RichUtils } from "draft-js";
import { read_cookie, delete_cookie } from "sfcookies";

export default class UserProfileContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params._id,
      username: "",
      phonenumber: "",
      password: "",
      email: ""
    };
  }

  // componentWillMount() {
  //   fetch("/api/farm_boys/users/" + this.state.id, {
  //     headers: { authorization: read_cookie("userKey") }
  //   })
  //     .then(response => response.json())
  //     .then(user =>
  //       this.setState({
  //         username: user.username,
  //         phonenumber: user.phonenumber,
  //         password: user.password,
  //         email: user.email
  //       })
  //     );
  // }

  componentWillMount() {
    fetch("/farm_boys/users/" + this.state.id)
      .then(response => response.json())
      .then(user =>
        this.setState({
          username: user.username,
          phonenumber: user.phonenumber,
          password: user.password,
          email: user.email
        })
      );
  }

  editProfile = () => {
    fetch("/farm_boys/users/" + this.state.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        phonenumber: this.state.phonenumber,
        password: this.state.password,
        email: this.state.email
      })
    });
  };

  deleteProfile = () => {
    fetch("/farm_boys/users/" + this.state.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: this.state.id
      })
    }).then(() => {
      delete_cookie("userKey");
      this.props.history.push("/");
    });
  };

  render() {
    console.log(this.state);
    return (
      <div>
        <div className="signUpModalContainer">
          <div>
            <input
              onChange={e => this.setState({ username: e.target.value })}
              type="text"
              value={this.state.username}
            />
          </div>
          <div>
            <input
              onChange={e => this.setState({ email: e.target.value })}
              type="text"
              value={this.state.email}
            />
          </div>
          <div>
            <input
              onChange={e => this.setState({ phonenumber: e.target.value })}
              type="text"
              value={this.state.phonenumber}
            />
          </div>
          <div>
            <input
              onChange={e => this.setState({ password: e.target.value })}
              type="password"
              value={this.state.password}
            />
          </div>
          <div>
            <input
              onChange={e => this.setState({ passwordConfirm: e.target.value })}
              type="password"
              placeholder="Confirm Password"
            />
          </div>
          <button onClick={() => this.editProfile()}>Update Account</button>
          <button onClick={() => this.deleteProfile()}>Delete Account</button>
        </div>
      </div>
    );
  }
}
