import React, { Component, PropTypes } from 'react';

// Credential component - represents a single web services credential, record contains username, logincompany, and sharedsecret
export default class Credential extends Component {
  render() {
    return (
      <li>{this.props.credential.logincompany} - {this.props.credential.username}</li>
    );
  }
}

Credential.propTypes = {
  // This component gets the credential to display through a React prop.
  // We can use propTypes to indicate it is required
  credential: PropTypes.object.isRequired,
};
