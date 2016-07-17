import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom'
import { createContainer } from 'meteor/react-meteor-data';

import { Credentials } from '../api/credentials.js';
import Credential from './Credential.jsx';

import { Segments } from '../api/segments.js';
import Segment from './Segment.jsx';

// App component - represents the whole app
class App extends Component {

  renderCredentials() {
    return this.props.credentials.map((credential) => (
      <Credential key={credential._id} credential={credential} />
    ));
  }

  renderSegments() {
    return this.props.segments.map((segment) => (
      <Segment key={segment._id} segment={segment} />
    ));
  }

  handleCredentialSubmit(event) {
    event.preventDefault();

    // Find the credentials details via the React ref
  const logincompany = ReactDOM.findDOMNode(this.refs.logincompanyInput).value.trim();
  const username = ReactDOM.findDOMNode(this.refs.usernameInput).value.trim();
  const sharedsecret = ReactDOM.findDOMNode(this.refs.sharedsecretInput).value.trim();

  Credentials.insert({
    logincompany,
    username,
    sharedsecret,
    createdAt: new Date(), // current time
  });

  // Clear form
  ReactDOM.findDOMNode(this.refs.logincompanyInput).value = '';
  ReactDOM.findDOMNode(this.refs.usernameInput).value = '';
  ReactDOM.findDOMNode(this.refs.sharedsecretInput).value = '';
  console.log("Add Credential Form submitted");
  }

  render() {
    return (
<div>
      <div className="container">
      <header>
            <h2>Add new Credentials Below, then press enter</h2>
          <form className="new-credential" onSubmit={this.handleCredentialSubmit.bind(this)} >
             <input
               type="text"
               ref="logincompanyInput"
               placeholder="Enter Web Services Login Company"
             />
             <input
               type="text"
               ref="usernameInput"
               placeholder="Enter Web Services Username"
             />
             <input
               type="text"
               ref="sharedsecretInput"
               placeholder="Enter Web Services Shared Secret"
             />
                   <button className="add" onClick={this.handleCredentialSubmit.bind(this)}>
                  Add
                  </button>
         </form>
    </header>
    </div>

    <div className="container">
         <header>
        <h1>Credential List</h1>
        <ul>
          {this.renderCredentials()}
        </ul>
        </header>
      </div>


      <div className="container">
        <header>
          <h1>Segment List</h1>


        <ul>
          {this.renderSegments()}
        </ul>
        </header>
      </div>
</div>
    );
  }
}

App.propTypes = {
  segments: PropTypes.array.isRequired,
  credentials: PropTypes.array.isRequired
};

export default createContainer(() => {
  return {
    segments: Segments.find({}).fetch(),
    credentials: Credentials.find({}).fetch()
  };
}, App);
