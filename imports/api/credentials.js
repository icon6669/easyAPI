import {Meteor} from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {check} from 'meteor/check';

export const Credentials = new Mongo.Collection('credentials');

Meteor.methods({
  'credentials.insert'(logincompany, wsusername, wssharedsecret) {
    check(logincompany, String);
    check(wsusername, String);
    check(wssharedsecret, String);

    // Make sure the user is logged in before inserting a credential
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Credentials.insert({
      logincompany,
      wsusername,
      wssharedsecret,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'credentials.remove'(credentialId) {
    check(credentialId, String);

    Credentials.remove(credentialId);
  },
  'credentials.setChecked'(credentialId, setChecked) {
    check(credentialId, String);
    check(setChecked, Boolean);

    Credentials.update(credentialId, { $set: { checked: setChecked } });
  },
});
