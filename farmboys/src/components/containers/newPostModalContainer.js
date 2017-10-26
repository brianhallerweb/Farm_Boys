import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/newPostContainer.css";
import "whatwg-fetch";
import { convertFromRaw, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../styles/react-draft-wysiwyg.css";
import { Button, Modal } from "react-bootstrap";

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

export default class NewPostModalContainer extends Component {
  constructor(props) {
    super(props);
    const contentState = convertFromRaw(content);
    this.state = {
      showModal: true,
      userId: "",
      title: "",
      type: "",
      price: "",
      contentState
    };
  }

  types = [
    <option selected disabled hidden>
      Choose Type
    </option>,
    <option>Meat</option>,
    <option>Dairy</option>,
    <option>Dessert</option>,
    <option>Produce</option>,
    <option>Other</option>
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
      body: JSON.stringify({
        userId: this.props.user._id,
        title: this.state.title,
        type: this.state.type,
        price: this.state.price,
        contentState: this.state.contentState
      })
    })
      .then(function(response) {
        return response.json();
      })
      .then(() => {
        this.props.updateAds();
        this.props.resetModal();
      });
  }

  render() {
    return (
      <div className="modal">
        <Modal
          show={this.state.showModal}
          onHide={() => {
            this.setState({ showModal: false });
            this.props.resetModal();
          }}
        >
          <Modal.Header closeButton />
          <Modal.Body>
            <div className="modalBody">
              <div>
                <div className="content">
                  <span>
                    <h1>Make an Ad</h1>
                    <input
                      type="text"
                      placeholder="Title"
                      onChange={e => this.setState({ title: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Price"
                      onChange={e => this.setState({ price: e.target.value })}
                    />
                    <select
                      onChange={e => {
                        this.setState({
                          type: e.target.value
                        });
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
                  <button onClick={() => this.createAd()}>
                    Save recipe to database
                  </button>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                this.setState({ showModal: false });
                this.props.resetModal();
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
