import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/userProfileContainer.css";
import "whatwg-fetch";
import { read_cookie, delete_cookie } from "sfcookies";
import {
  Button,
  Modal,
  Table,
  FormGroup,
  FormControl,
  ControlLabel,
  InputGroup
} from "react-bootstrap";
import { convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../styles/react-draft-wysiwyg.css";
import * as EmailValidator from "email-validator";

var phone = require("phone");

export default class UserProfileContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      id: props.match.params._id,
      username: "",
      newUsername: "",
      phonenumber: "",
      showPassword: false,
      password: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
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
          newUsername: user.username,
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
      selectedAd: Object.assign({}, selectedAd, {
        description: contentState
      })
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

  checkPassword() {
    if (
      (this.state.password === this.state.oldPassword &&
        this.state.newPassword === this.state.confirmPassword) ||
      (this.state.oldPassword === "" &&
        this.state.newPassword === "" &&
        this.state.confirmPassword === "")
    ) {
      return true;
    } else {
      return false;
    }
  }

  editProfile = () => {
    let isValid = this.checkPassword();
    if (!EmailValidator.validate(this.state.email)) {
      isValid = false;
      alert("Invalid email address!");
    }
    if (phone(this.state.phonenumber).length > 0) {
      this.state.phonenumber = phone(this.state.phonenumber)
        .shift()
        .concat();
    } else {
      isValid = false;
      alert("Invalid phone number!");
    }
    if (isValid) {
      if (this.state.newPassword !== "") {
        this.state.password = this.state.newPassword;
      }
      fetch("/farm_boys/users/" + this.state.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.state.newUsername,
          phonenumber: this.state.phonenumber,
          password: this.state.password,
          email: this.state.email
        })
      })
        .then(response => response.json())
        .then(() => {
          alert("Update Successful!");
          this.setState({
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
          });
        });
    }
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
    const { contentState } = this.state.selectedAd;
    let oldPasswordStyle =
      this.state.oldPassword === this.state.password
        ? { color: "#000000" }
        : { color: "#ff0000" };
    let confirmPasswordStyle =
      this.state.newPassword === this.state.confirmPassword
        ? { color: "#000000" }
        : { color: "#ff0000" };

    return (
      <div>
        <div className="gridProfile">
          <div className="user">
            <div>
              <Link to="/">Home</Link>
            </div>
            <div className="userInfo">
              <div>
                <div>
                  <h2>{this.state.newUsername}</h2>
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
                    onChange={e =>
                      this.setState({ phonenumber: e.target.value })}
                    type="text"
                    value={this.state.phonenumber}
                  />
                </div>
                {this.state.showPassword ? (
                  <div>
                    {" "}
                    <div>
                      <input
                        onChange={e =>
                          this.setState({ oldPassword: e.target.value })}
                        type="password"
                        value={this.state.oldPassword}
                        placeholder="Old Password"
                        style={oldPasswordStyle}
                      />
                    </div>
                    <div>
                      <input
                        onChange={e =>
                          this.setState({ newPassword: e.target.value })}
                        type="password"
                        value={this.state.newPassword}
                        placeholder="New Password"
                        style={oldPasswordStyle}
                      />
                    </div>
                    <div>
                      <input
                        onChange={e =>
                          this.setState({ confirmPassword: e.target.value })}
                        type="password"
                        value={this.state.confirmPassword}
                        placeholder="Confirm New Password"
                        style={confirmPasswordStyle}
                      />
                    </div>
                    <button
                      onClick={() =>
                        this.setState({
                          showPassword: !this.state.showPassword
                        })}
                    >
                      Hide Password
                    </button>
                    <h1 />
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() =>
                        this.setState({
                          showPassword: !this.state.showPassword
                        })}
                    >
                      Change Password
                    </button>
                    <h1 />
                  </div>
                )}
                <Button
                  bsStyle="info"
                  bsSize="xs"
                  onClick={() => this.editProfile()}
                >
                  Update Account
                </Button>{" "}
                <Button
                  bsStyle="danger"
                  bsSize="xs"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete's this account?"
                      ) == true
                    ) {
                      this.deleteProfile();
                    }
                  }}
                >
                  Delete Account
                </Button>
              </div>
            </div>
            <hr />
            <div className="ads">
              <h3>Your Ads</h3>
              <Table hover responsive bordered condensed>
                <tbody>
                  {this.state.myAds.map(ad => (
                    <tr>
                      <td
                        onClick={() =>
                          this.setState({
                            showModal: true,
                            selectedAd: ad
                          })}
                      >
                        {ad.title}
                      </td>
                      <td>
                        <Button
                          bsStyle="info"
                          bsSize="xs"
                          onClick={() =>
                            this.setState({
                              showModal: true,
                              selectedAd: ad
                            })}
                        >
                          edit
                        </Button>
                      </td>
                      <td>
                        <Button
                          bsStyle="danger"
                          bsSize="xs"
                          onClick={() => {
                            if (
                              window.confirm(
                                'Are you sure you want to delete the ad titled "' +
                                  ad.title +
                                  '"?'
                              ) == true
                            ) {
                              this.deleteAd(ad._id);
                            }
                          }}
                        >
                          delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="modal">
                <Modal
                  show={this.state.showModal}
                  onHide={() => {
                    this.setState({ showModal: false });
                  }}
                >
                  <Modal.Header closeButton />
                  <Modal.Body>
                    {/*<div className="modalBody">
                    <div>
                      <div className="content">
                        <span>
                          <h1>Edit your Ad</h1>
                          <input
                            type="text"
                            defaultValue={this.state.selectedAd.title}
                            onChange={e =>
                              (this.state.selectedAd.title = e.target.value)}
                          />
                          <input
                            type="text"
                            defaultValue={this.state.selectedAd.price}
                            onChange={e =>
                              (this.state.selectedAd.price = e.target.value)}
                          />
                          <select
                            autofocus={this.state.selectedAd.type}
                            onChange={e => {
                              this.state.selectedAd.type = e.target.value;
                            }}
                          >
                            {this.setType(
                              this.state.selectedAd.type || "meat"
                            )}
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
                          onClick={() =>
                            this.editAd(this.state.selectedAd._id)}
                        >
                          Update Ad
                        </button>
                      </div>
                    </div>
                  </div>
*/}

                    <form>
                      <FormGroup>
                        <ControlLabel>Title</ControlLabel>
                        <FormControl
                          type="text"
                          defaultValue={this.state.selectedAd.title}
                          onChange={e =>
                            this.setState({ title: e.target.value })}
                        />
                      </FormGroup>
                      <FormGroup>
                        <ControlLabel>Price</ControlLabel>
                        <InputGroup>
                          <InputGroup.Addon>$</InputGroup.Addon>
                          <FormControl
                            type="number"
                            defaultValue={this.state.selectedAd.price}
                            onChange={e =>
                              this.setState({ price: e.target.value })}
                          />

                          <InputGroup.Addon>.00</InputGroup.Addon>
                        </InputGroup>
                      </FormGroup>

                      <FormGroup controlId="formControlsSelect">
                        <ControlLabel>Food Type</ControlLabel>
                        <FormControl
                          componentClass="select"
                          placeholder="select"
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
                      </FormGroup>

                      <FormGroup>
                        <ControlLabel>Contact</ControlLabel>
                        <FormControl
                          type="text"
                          defaultValue={this.state.selectedAd.contact}
                          onChange={e =>
                            this.setState({ contact: e.target.value })}
                        />
                      </FormGroup>

                      <Button
                        bsStyle="primary"
                        type="submit"
                        onClick={() => this.createAd()}
                      >
                        Update Ad
                      </Button>
                    </form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      onClick={() => this.editAd(this.state.selectedAd._id)}
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
