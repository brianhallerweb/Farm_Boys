import React, { Component } from "react";
import "../styles/queryContainer.css";

export default class QueryContainer extends Component {
  state = {
    type: "Dairy",
    search: ""
  };

  buildQuery() {
    let typeQuery = "";
    let searchQuery = "";
    if (this.state.type !== "") {
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
        <div>
          <input
            type="text"
            placeholder="Search Term"
            onChange={e => this.setState({ search: e.target.value })}
          />
          <select onChange={e => this.setState({ type: e.target.value })}>
            <option>Dairy</option>
            <option>Produce</option>
            <option>Protien</option>
            <option>Dessert</option>
          </select>

          <button onClick={() => query(this.buildQuery())}>Submit</button>
        </div>
      </div>
    );
  }
}
