import { Accounts } from 'meteor/accounts-base';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL',
});


const services = Meteor.settings.oAuth;

const configure = () => {
  if ( services ) {
    for( let service in services ) {
      ServiceConfiguration.configurations.upsert( { service: service }, {
        $set: services[ service ]
      });
    }
  }
};

//Modules.server.configureServices = configure;
