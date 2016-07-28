import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom'
import { createContainer } from 'meteor/react-meteor-data';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

import { Credentials } from '../api/credentials.js';
import Credential from './Credential.jsx';

import { Segments } from '../api/segments.js';
import Segment from './Segment.jsx';
import '../api/adobeApi-client.js';


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
    const wsusername = ReactDOM.findDOMNode(this.refs.usernameInput).value.trim();
    const wssharedsecret = ReactDOM.findDOMNode(this.refs.sharedsecretInput).value.trim();

    Meteor.call('credentials.insert', logincompany, wsusername, wssharedsecret);

    // Clear form
    ReactDOM.findDOMNode(this.refs.logincompanyInput).value = '';
    ReactDOM.findDOMNode(this.refs.usernameInput).value = '';
    ReactDOM.findDOMNode(this.refs.sharedsecretInput).value = '';
    console.log("Add Credential Form submitted");
    }


    selectAllSegments(event) {
      Meteor.call('segments.selectAll');
    }

  handleRequestSegments(event) {
      event.preventDefault();
      var selectedCredentials = Credentials.find({checked: true});
    //  var credentialCount=segmentCount=0;

      selectedCredentials.forEach(function (credential){
      console.log("requesting segments from "+credential.logincompany);

      var omUsername=credential.wsusername;
      var omSharedSecret=credential.wssharedsecret;
      var omEndpoint='api.omniture.com';


        function getSegmentsList() {
            //refactor to make json request fields selectable from checkbox list
        requestJSON='{"fields":["tags","definition","description"]}';
        		getAnalyticsClient().makeRequest("Segments.Get", requestJSON, handleSegmentList).fail(function (data) {
        			if (typeof data.responseJSON.error_description !== "undefined") {
        				console.log("api responseJSON.error is: "+data.responseJSON.error_description);
        			}
        		}).done(function() {
                console.log("segment request complete");
        		});
        	}

      	function handleSegmentList(data) {
          console.log("count of data passed to handleSegmentList is: "+data.length);
            data.forEach(function (segment){
              const id = segment.id;
              const name = segment.name;
              const tags = segment.tags;
              const definition = segment.definition;
              const description = segment.description;

            Meteor.call('segments.upsert',
                          segment.id,
                          segment.name,
                          segment.tags,
                          segment.definition,
                          segment.description
                        );
          //  segmentCount+=1;
            });

        }


    	function getAnalyticsClient() {
        return MarketingCloud.getAnalyticsClient(omUsername, omSharedSecret, omEndpoint);
    	}

      getSegmentsList();
      //Meteor.call('credentials.setChecked',selectedCredentials,false);
      //credentialCount+=1;
    });
    }



/*
  handleSaveSegments(event) {
    event.preventDefault();
    var selectedCredentials = Credentials.find({checked: true});
  //  var credentialCount=segmentCount=0;

    selectedCredentials.forEach(function (credential){
    console.log("saving segments to "+credential.logincompany);

    var omUsername=credential.wsusername;
    var omSharedSecret=credential.wssharedsecret;
    var omEndpoint='api.omniture.com';
    }
  } */

  render() {
    return (
    <div>
          <div className="container">

          <AccountsUIWrapper />
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
              <button className="selectAllSegments" onClick={this.selectAllSegments.bind(this)}>
             Select All Segments
             </button>

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
