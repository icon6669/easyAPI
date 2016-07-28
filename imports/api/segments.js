import { Mongo } from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import { Match } from 'meteor/check'

export const Segments = new Mongo.Collection('segments');


Meteor.methods({
  'segments.setChecked'(segmentId, setChecked) {
    check(segmentId, String);
    check(setChecked, Boolean);

    Segments.update(segmentId, { $set: { checked: setChecked } });
  },
  'segments.selectAll'(){
    Segments.update({},{
      $set: {checked: 'checked'}
    });
  },

  'segments.unselectAll'(){
    Segments.update({},{
      $set: {checked: 'false'}
    });
  },

  'segments.remove'(segmentId) {
    check(segmentId, String);

    Segments.remove(segmentId);
  },

'segments.upsert'(id, name, tags, reportSuiteId, definition, description) {
  check(id, String);
  check(name, String);
  //check(tags, Match.Maybe([String]));
  //check(description, Match.Maybe(String));

  Segments.upsert({
          //Selector
          id:id
          },{
            $set:{
            //Modifier
            id,
            name,
            tags,
            reportSuiteId,
            definition,
            description,
            time: Date.now() // current time
            }
          });
        },
});
