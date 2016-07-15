import React, { Component, PropTypes } from 'react';

// Segment component - represents a single segment
export default class Segment extends Component {
  render() {
    return (
      <li>{this.props.segment.name}</li>
    );
  }
}
 
Segment.propTypes = {
  // This component gets the segment to display through a React prop.
  // We can use propTypes to indicate it is required
  segment: PropTypes.object.isRequired,
};
