import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/newPostContainer.css";
import "whatwg-fetch";
import { convertFromRaw, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../styles/react-draft-wysiwyg.css";

const content = {
  entityMap: {},
  blocks: [
    {
      key: "637gr",
      text: "Initialized from content state.",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    }
  ]
};

export default class NewPostContainer extends Component {
  constructor(props) {
    super(props);
    const contentState = convertFromRaw(content);
    this.state = {
      title: "",
      type: "",
      firstElement: false,
      contentState
    };
  }

  types = [
    <option>Choose a Type</option>,
    <option>Meat</option>,
    <option>Dairy</option>,
    <option>Dessert</option>,
    <option>Produce</option>
  ];

  onContentStateChange: Function = contentState => {
    this.setState({
      contentState
    });
  };

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
    console.log(this.state.contentState);
    return (
      <div className="content">
        <span>
          <h1>Make an Ad</h1>
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
        <div className="targetAll">
          <Editor
            editorClassName="targetEditor"
            onContentStateChange={this.onContentStateChange}
            placeholder={"Begin typing..."}
            spellCheck={true}
            toolbar={{
              options: [
                "inline",
                "blockType",
                "fontSize",
                "fontFamily",
                "list",
                "textAlign",
                "colorPicker"
              ],
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true }
            }}
          />
        </div>
        <button onClick={() => this.createAd()}>Save recipe to database</button>
      </div>
    );
  }
}
