import React, { Component, PropTypes } from 'react';
import {Credentials} from '../api/credentials.js';
import {Meteor} from 'meteor/meteor';

// Credential component - represents a single web services credential, record contains username, logincompany, and sharedsecret
export default class Credential extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value

    Meteor.call('credentials.setChecked',this.props.credential._id, !this.props.credential.checked);

    // set var with selected credential id
    //var selectedCredential = this.props.credential._id;
  }

  deleteThisCredential() {
    Meteor.call('credentials.remove', this.props.credential._id);
  }

  render() {

// Give credentials a different className when they are checked off,
// so that we can style them nicely in CSS
const credentialClassName = this.props.credential.checked ? 'checked' : '';

    return (
      <li className={credentialClassName}>
      <button className="delete" onClick={this.deleteThisCredential.bind(this)}>
        &times;
      </button>

      <input
        type="checkbox"
        readOnly
        checked={this.props.credential.checked}
        onClick={this.toggleChecked.bind(this)}
      />

      <span className="credentialLabel">{this.props.credential.logincompany} - {this.props.credential.wsusername}</span>
      </li>
    );
  }
}

Credential.propTypes = {
  // This component gets the credential to display through a React prop.
  // We can use propTypes to indicate it is required
  credential: PropTypes.object.isRequired,
};
