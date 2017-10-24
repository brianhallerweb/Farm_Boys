import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/newPostContainer.css";
import "whatwg-fetch";
import { Editor, EditorState, RichUtils } from "draft-js";

export default class NewPostContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      title: "",
      description: "",
      type: "",
      firstElement: false
    };
    this.types = [
      <option>Choose a Type</option>,
      <option>Meat</option>,
      <option>Dairy</option>,
      <option>Dessert</option>,
      <option>Produce</option>
    ];
    this.onChange = editorState => this.setState({ editorState });
  }

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
  }

  createAd() {
    fetch("/farm_boys/ads", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state)
    }).then(function(response) {
      return response.json();
    });
  }

  render() {
    console.log(this.types[0]);
    return (
      <div className="content">
        <span>
          <h1>Make an Ad</h1>

          {/* <button onClick={this._onBoldClick.bind(this)}>Bold</button> */}
          <input
            type="text"
            placeholder="Title"
            onChange={e => this.setState({ title: e.target.value })}
          />
          <select
            onChange={e => {
              if (!this.state.firstElement) {
                this.types.shift();
              }
              this.setState({ type: e.target.value, firstElement: true });
            }}
          >
            {this.types}
          </select>
        </span>
        <div>
          <textarea
            onChange={e => this.setState({ description: e.target.value })}
            placeholder="'e. g. Ive got Moldy Peaches'"
            cols="40"
            rows="5"
            style={{ resize: "none" }}
          />
        </div>

        {/* <div className="editor">
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div> */}
        <button onClick={this.createAd.bind(this)}>Submit</button>
      </div>
    );
  }
}
