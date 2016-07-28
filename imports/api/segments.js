import { Mongo } from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

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

'segments.upsert'(id, name, tags, definition, description) {
  check(id, String);
  check(name, String);
  check(tags, [String]);
  check(description, String);

  Segments.upsert({
          //Selector
          id:id
          },{
            $set:{
            //Modifier
            id,
            name,
            tags,
            definition,
            description,
            time: Date.now() // current time
            }
          });
        },
});
