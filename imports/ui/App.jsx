import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom'
import { createContainer } from 'meteor/react-meteor-data';

import { Credentials } from '../api/credentials.js';
import Credential from './Credential.jsx';

import { Segments } from '../api/segments.js';
import Segment from './Segment.jsx';
import '../api/adobeApi-client.js';
import '../api/adobeApi-handlers.js';

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

  handleRequestSegments(event) {
      event.preventDefault();
      var selectedCredentials = Credentials.find({checked: true});
      var count=0;

      selectedCredentials.forEach(function (credential){
        //API CODE GOES HERE
      console.log("requesting segments from "+credential.logincompany);
      //  console.log("public settings are: "+Meteor.settings);


        // Get all available metrics using the Client object
       var omUsername='kjemison:BBVA';
      var omSharedSecret='b6153ed23eba53daa342dea0e0ca6c27';
      var omEndpoint='api.omniture.com';
      options={version: '1.4'};


      
      function getSegmentsList() {
    requestJSON='';
    		getAnalyticsClient().makeRequest("Segments.Get", requestJSON, handleResults).fail(function (reportData) {
    			if (typeof data.responseJSON.error_description !== "undefined") {
    				console.log("api responseJSON.error is: "+data.responseJSON.error_description);
    			}
    		}).done(function() {
            console.log("api response passed to handleResults function");
    		});
    	}

    	function handleResults(data) {
    		console.log("data passed to handleResults is: "+data);
    	}

    	function getAnalyticsClient() {
    		return MarketingCloud.getAnalyticsClient(omUsername, omSharedSecret, omEndpoint);
    	}


      getSegmentsList();

          count+=1;
  });

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
        <button className="requestSegments" onClick={this.handleRequestSegments.bind(this)}>
       Request Segments from Selected Credential
       </button>
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
