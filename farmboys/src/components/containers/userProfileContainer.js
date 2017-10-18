import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/userProfileContainer.css";
import "whatwg-fetch";
import { Editor, EditorState, RichUtils } from "draft-js";

export default class UserProfileContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params._id,
      username: ""
    };
  }

  componentWillMount() {
    fetch("/farm_boys/users/" + this.state.id)
      .then(response => response.json())
      .then(user => this.setState({ username: user.username }));
  }

  render() {
    return (
      <div>
        <h1>{this.state.username}</h1>
      </div>
    );
  }
}
