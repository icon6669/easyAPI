
import '../imports/api/credentials.js';
import '../imports/api/segments.js';




  Meteor.methods({
    'getAnalyticsSegments': function (credential) {
      // avoid blocking other method calls from the same client
      this.unblock();
      var apiUrl = 'https://api.omniture.com/admin/1.4/rest/?method=Segments.Get' + ip;
      // asynchronous call to the dedicated API calling function
      var response = Meteor.wrapAsync(apiCall)(apiUrl);
      return response;
    }
  });
