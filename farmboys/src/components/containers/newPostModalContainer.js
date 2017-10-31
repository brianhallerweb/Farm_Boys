import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/newPostContainer.css";
import "whatwg-fetch";
import { convertFromRaw, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../styles/react-draft-wysiwyg.css";
import {
  Button,
  Modal,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";

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

export default class briansCreateNewAd extends Component {
  constructor(props) {
    super(props);
    const contentState = convertFromRaw(content);
    this.state = {
      showModal: true,
      userId: "",
      title: "",
      type: "",
      price: "",
      contact: "",
      contentState
    };
  }

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
        username: this.props.user.username,
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
            <form>
              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Enter title"
                  onChange={e => this.setState({ title: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Price</ControlLabel>
                <FormControl
                  type="number"
                  placeholder="Enter price in dollars"
                  onChange={e => this.setState({ price: e.target.value })}
                />
              </FormGroup>

              <FormGroup controlId="formControlsSelect">
                <ControlLabel>Food Type</ControlLabel>
                <FormControl
                  componentClass="select"
                  placeholder="Select"
                  onChange={e => {
                    this.setState({
                      type: e.target.value
                    });
                  }}
                >
                  <option>Meat</option>,
                  <option>Dairy</option>,
                  <option>Dessert</option>,
                  <option>Produce</option>,
                  <option>Other</option>
                </FormControl>
              </FormGroup>

              <FormGroup controlId="formControlsTextarea">
                <ControlLabel>Description</ControlLabel>
                <div className="targetAll">
                  <Editor
                    editorClassName="targetEditor"
                    onContentStateChange={this.onContentStateChange}
                    placeholder={"Describe your product"}
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
              </FormGroup>

              <FormGroup>
                <ControlLabel>Contact</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Enter your preferred contact information"
                  onChange={e => this.setState({ contact: e.target.value })}
                />
              </FormGroup>

              <Button
                bsStyle="primary"
                type="submit"
                onClick={() => this.createAd()}
              >
                Post New Ad
              </Button>
            </form>
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
