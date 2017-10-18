import { Link } from "react-router-dom";
import "../styles/adContainer.css";
import React from "react";

const AdContainer = props => (
  <div className="adContainer">
    <ul>
      {props.ads.map(ad => (
        <li>
          <Link to={"/ad_page/" + ad._id}>{ad.title}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default AdContainer;
