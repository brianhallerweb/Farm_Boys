import React, { Component } from "react";
import draftToHtml from "draftjs-to-html";
import "../styles/adPageContainer.css";
import "whatwg-fetch";

export default class AdPageContainer extends Component {
  state = {
    title: "",
    markup: ""
  };

  getAd(id) {
    fetch("/farm_boys/ads/" + id)
      .then(response => response.json())
      .then(ad =>
        this.setState({ title: ad.title, markup: draftToHtml(ad.description) })
      );
  }

  componentWillReceiveProps(newProps) {
    let id = this.props.match.params._id;
    let newId = newProps.match.params._id;
    if (id !== newId) {
      this.getAd(newId);
    }
  }

  componentDidMount() {
    let id = this.props.match.params._id;
    this.getAd(id);
  }

  render() {
    return (
      <div className="adPageContainer">
        <div>
          <h1>{this.state.title}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html: this.state.markup
            }}
          />
        </div>
      </div>
    );
  }
}
