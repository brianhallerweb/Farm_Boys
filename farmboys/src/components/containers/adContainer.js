import { Link } from "react-router-dom";
import "../styles/adContainer.css";

export default const AdContainer = () =>
      (<div className="adContainer">
        <ul>
          {this.props.ads.map(ad => (
            <li>
              <Link to={"/ad_page/" + ad._id}>{ad.title}</Link>
            </li>
          ))}
        </ul>
      </div>)
