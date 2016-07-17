import React, { Component, PropTypes } from 'react';
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

  render() {
    return (
<div>
      <div className="container">
        <header>
          <h1>Credentials List</h1>
        </header>

        <ul>
          {this.renderCredentials()}
        </ul>
      </div>


      <div className="container">
        <header>
          <h1>Segment List</h1>
        </header>

        <ul>
          {this.renderSegments()}
        </ul>
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
