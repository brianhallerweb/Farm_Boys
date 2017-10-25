import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./index.css";
import FrontPageContainer from "./components/containers/frontPageContainer";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import NewPostContainer from "./components/containers/newPostContainer";
import SignUpPageContainer from "./components/containers/signUpPageContainer";
import UserProfileContainer from "./components/containers/userProfileContainer";

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={FrontPageContainer} />
      <Route exact path="/create_ad" component={NewPostContainer} />
      <Route exact path="/signUp" component={SignUpPageContainer} />
      <Route exact path="/my_profile/:_id" component={UserProfileContainer} />
    </div>
  </Router>,
  document.getElementById("root")
);

registerServiceWorker();
