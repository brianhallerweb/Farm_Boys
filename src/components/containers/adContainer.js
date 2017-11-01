import "../styles/adContainer.css";
import React, { Component } from "react";
import AdModalContainer from "./adModalContainer";
import { Table, Pagination } from "react-bootstrap";

export default class AdContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: ""
    };
    this.resetModal = this.resetModal.bind(this);
  }

  resetModal() {
    this.setState({ modal: "" });
  }

  render() {
    return (
      <div className="adList">
        <Table hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {this.props.ads.map(ad => (
              <tr
                onClick={() =>
                  this.setState({
                    modal: (
                      <AdModalContainer resetModal={this.resetModal} ad={ad} />
                    )
                  })}
              >
                <td>{ad.title}</td>
                <td>${ad.price}</td>
                <td>{ad.date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination
          bsSize="small"
          prev
          next
          ellipsis
          boundaryLinks
          items={10}
          maxButtons={3}
          activePage={this.props.activePage}
          onSelect={e => this.props.handlePagination(e)}
        />
        {this.state.modal}
      </div>
    );
  }
}
