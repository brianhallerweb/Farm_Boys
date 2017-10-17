import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./index.css";
import FrontPageContainer from "./components/containers/frontPageContainer";
import AdPageContainer from "./components/containers/adPageContainer";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={FrontPageContainer} />
      <Route exact path="/ad_page/:_id" component={AdPageContainer} />
    </div>
  </Router>,
  document.getElementById("root")
);

registerServiceWorker();
