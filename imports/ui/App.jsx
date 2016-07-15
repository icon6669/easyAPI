import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Segments } from '../api/segments.js';
import Segment from './Segment.jsx';

// App component - represents the whole app
class App extends Component {


  renderSegments() {
    return this.props.segments.map((segment) => (
      <Segment key={segment._id} segment={segment} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Segment List</h1>
        </header>

        <ul>
          {this.renderSegments()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  segments: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    segments: Segments.find({}).fetch(),
  };
}, App);
