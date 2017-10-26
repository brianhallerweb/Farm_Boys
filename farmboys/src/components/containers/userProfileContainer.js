import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/userProfileContainer.css";
import "whatwg-fetch";
import { read_cookie, delete_cookie } from "sfcookies";
import { Button, Modal } from "react-bootstrap";
import { convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../styles/react-draft-wysiwyg.css";

export default class UserProfileContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      id: props.match.params._id,
      username: "",
      phonenumber: "",
      password: "",
      email: "",
      myAds: [],
      selectedAd: ""
    };
  }

  setType = type => {
    let meatSelected,
      dairySelected,
      dessertSelected,
      produceSelected,
      otherSelected = false;
    switch (type.toLowerCase()) {
      case "meat":
        meatSelected = true;
        break;
      case "diary":
        dairySelected = true;
        break;
      case "dessert":
        dessertSelected = true;
        break;
      case "produce":
        produceSelected = true;
        break;
      case "other":
        otherSelected = true;
        break;
    }
    return [
      <option selected={meatSelected}>Meat</option>,
      <option selected={dairySelected}>Dairy</option>,
      <option selected={dessertSelected}>Dessert</option>,
      <option selected={produceSelected}>Produce</option>,
      <option selected={otherSelected}>Other</option>
    ];
  };

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
    fetch("/farm_boys/ads/?id=" + this.state.id)
      .then(response => response.json())
      .then(myAds => this.setState({ myAds }));
  }

  onContentStateChange: Function = contentState => {
    const { selectedAd } = this.state;
    this.setState({
      selectedAd: Object.assign({}, selectedAd, { description: contentState })
    });
  };

  editAd = adToEdit => {
    fetch("/farm_boys/ads/" + adToEdit, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: this.state.selectedAd.title,
        type: this.state.selectedAd.type,
        description: this.state.selectedAd.description,
        price: this.state.selectedAd.price
      })
    }).then(() => {
      this.setState({ showModal: false });
      fetch("/farm_boys/ads/?id=" + this.state.id)
        .then(response => response.json())
        .then(myAds => this.setState({ myAds }));
    });
  };

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

  deleteAd = adToDelete => {
    fetch("/farm_boys/ads/" + adToDelete, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: adToDelete
      })
    }).then(() => {
      fetch("/farm_boys/ads/?id=" + this.state.id)
        .then(response => response.json())
        .then(myAds => this.setState({ myAds }));
    });
  };

  render() {
    console.log(this.state.selectedAd);
    const { contentState } = this.state.selectedAd;
    return (
      <div>
        <div>
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
        <h1>Your Ads</h1>
        <ul className="list">
          {this.state.myAds.map(ad => (
            <li>
              {ad.title}
              <button
                onClick={() =>
                  this.setState({
                    showModal: true,
                    selectedAd: ad
                  })}
              >
                edit
              </button>
              <button onClick={() => this.deleteAd(ad._id)}>delete</button>
            </li>
          ))}
        </ul>
        <div className="modal">
          <Modal
            show={this.state.showModal}
            onHide={() => {
              this.setState({ showModal: false });
            }}
          >
            <Modal.Header closeButton />
            <Modal.Body>
              <div className="modalBody">
                <div>
                  <div className="content">
                    <span>
                      <h1>Edit your Ad</h1>
                      <input
                        type="text"
                        defaultValue={this.state.selectedAd.title}
                        onChange={e => this.setState({ title: e.target.value })}
                      />
                      <input
                        type="text"
                        defaultValue={this.state.selectedAd.price}
                        onChange={e => this.setState({ price: e.target.value })}
                      />
                      <select
                        autofocus={this.state.selectedAd.type}
                        onChange={e => {
                          this.setState({
                            type: e.target.value
                          });
                        }}
                      >
                        {this.setType(this.state.selectedAd.type || "meat")}
                      </select>
                    </span>
                    <div className="targetAll">
                      {this.state.selectedAd.description ? (
                        <Editor
                          initialContentState={
                            this.state.selectedAd.description
                          }
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
                      ) : (
                        ""
                      )}
                    </div>
                    <button
                      onClick={() => this.editAd(this.state.selectedAd._id)}
                    >
                      Update Ad
                    </button>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => {
                  this.setState({ showModal: false });
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}
