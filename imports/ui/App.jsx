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
        requestJSON='{"accessLevel":"all","fields":["tags","definition","description","reportSuiteID"]}';
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

            Meteor.call('segments.upsert',
                          segment.id,
                          segment.name,
                          segment.tags,
                          segment.reportSuiteID,
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
      //selectedCredentials.forEach(Meteor.call('credentials.setChecked',selectedCredentials._id,false);
      //credentialCount+=1;
    });
    }

    handleSetDestinationRSID(event){

    }


  handleSaveSegments(event) {
      event.preventDefault();
      var destinationReportSuiteID = ReactDOM.findDOMNode(this.refs.destinationReportSuiteIDInput).value.trim();
      var selectedCredentials = Credentials.find({checked: true});
      //  var credentialCount=segmentCount=0;

      selectedCredentials.forEach(function (credential){
        console.log("saving segments to "+credential.logincompany);

        var omUsername=credential.wsusername;
        var omSharedSecret=credential.wssharedsecret;
        var omEndpoint='api.omniture.com';

        function saveSegments() {
            //refactor to make json request fields selectable from checkbox list

        selectedSegments=Segments.find({checked: true})
            selectedSegments.forEach(function (segment){
                requestJSON='{"definition":'+JSON.stringify(segment.definition)+',"reportSuiteID":"'+destinationReportSuiteID+'","description":"'+segment.description+'","name":"'+segment.name+'"}';
              //comment out line below after dev
              //console.log("temp requestJson is: "+requestJSON);
                    getAnalyticsClient().makeRequest("Segments.Save", requestJSON, handleSaveResponse).fail(function (data) {
                      if (typeof data.responseJSON.error_description !== "undefined") {
                        console.log("api responseJSON.error is: "+data.responseJSON.error_description);
                      }
                    }).done(function() {
                        console.log("segment save request complete");
                    });

            });
        }


      function handleSaveResponse(data) {
        console.log("segment save response json including id is: "+JSON.stringify(data));
      }

      function getAnalyticsClient() {
        return MarketingCloud.getAnalyticsClient(omUsername, omSharedSecret, omEndpoint);
      }

    saveSegments();

    });

  }

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
             <button className="saveSelectedSegments" onClick={this.handleSaveSegments.bind(this)}>
            Save Selected Segments
            </button>
            
            <form className="destinationReportSuite" onSubmit={this.handleSetDestinationRSID.bind(this)} >
               <input
                 type="text"
                 ref="destinationReportSuiteIDInput"
                 placeholder="Enter Destination Report Suite ID"
               />
           </form>

            <ul>
              {this.renderSegments()}
            </ul>



            <button className="saveSelectedSegments" onClick={this.handleSaveSegments.bind(this)}>
           Save Selected Segments
           </button>
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
