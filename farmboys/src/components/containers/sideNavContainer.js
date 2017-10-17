import LoginContainer from "./loginContainer";
import QueryContainer from "./queryContainer";
import "../styles/sideNavContainer.css";

const SideNavContainer = props => (
  <div className="sideNavContainer">
    <div>
      <div>
        <LoginContainer />
      </div>
      <div>
        <QueryContainer query={props.query} />
      </div>
    </div>
  </div>
);

export default SideNavContainer;
