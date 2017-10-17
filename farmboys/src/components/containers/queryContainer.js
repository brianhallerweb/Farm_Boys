import React, { Component } from "react";
import "../styles/queryContainer.css";

export default class QueryContainer extends Component {
  state = {
    type: "",
    search: ""
  };

  render() {
    const { query } = this.props;
    return (
      <div className="queryContainer">
        <input
          type="text"
          defaultValue="Search Term"
          onChange={e => this.setState({ search: e.target.value })}
        />
        <select onChange={e => this.setState({ search: e.target.value })}>
          <option>Dairy</option>
          <option>Produce</option>
          <option>Meat</option>
          <option>Dessert</option>
        </select>
        <button onClick={() => query(this.state)}>Submit</button>
      </div>
    );
  }
}
