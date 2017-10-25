import React, { Component } from "react";
import "../styles/queryContainer.css";

export default class QueryContainer extends Component {
  state = {
    type: "All Types",
    search: ""
  };

  buildQuery() {
    let typeQuery = "";
    let searchQuery = "";
    if (this.state.type !== "All Types") {
      typeQuery = "?type=" + this.state.type;
    }
    if (this.state.search !== "") {
      searchQuery = "&title=" + this.state.search;
    }
    return typeQuery + searchQuery;
  }

  render() {
    const { query } = this.props;
    return (
      <div className="queryContainer">
        <input
          type="text"
          placeholder="Search Term"
          onChange={e => this.setState({ search: e.target.value })}
        />
        <select onChange={e => this.setState({ type: e.target.value })}>
          <option>All Types</option>
          <option>Dairy</option>
          <option>Produce</option>
          <option>Meat</option>
          <option>Dessert</option>
          <option>Other</option>
        </select>
        <button onClick={() => query(this.buildQuery())}>Submit</button>
      </div>
    );
  }
}
