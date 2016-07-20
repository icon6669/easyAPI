import React, { Component, PropTypes } from 'react';
import {Segments} from '../api/segments.js';

// Segment component - represents a single web services segment, record contains username, logincompany, and sharedsecret
export default class Segment extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Segments.update(this.props.segment._id, {
      $set: { checked: !this.props.segment.checked },
    });
  }

  deleteThisSegment() {
    Segments.remove(this.props.segment._id);
  }

  render() {

// Give segments a different className when they are checked off,
// so that we can style them nicely in CSS
const segmentClassName = this.props.segment.checked ? 'checked' : '';

    return (
      <li className={segmentClassName}>
      <button className="delete" onClick={this.deleteThisSegment.bind(this)}>
        &times;
      </button>

      <input
        type="checkbox"
        readOnly
        checked={this.props.segment.checked}
        onClick={this.toggleChecked.bind(this)}
      />

      <span className="segmentLabel">{this.props.segment.name}  </span>
      <span className="segmentLabel">  Tags are: {this.props.segment.tags}</span>

      </li>
    );
  }
}

Segment.propTypes = {
  // This component gets the segment to display through a React prop.
  // We can use propTypes to indicate it is required
  segment: PropTypes.object.isRequired,
};
