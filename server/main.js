import {Meteor} from 'meteor/meteor';
import '../imports/app/api/messages.js';
import {Dump} from '../imports/app/api/webmDump.js';

Meteor.startup(() => {
  // Meteor.publish('files.dump.all', function () {
  //   return Dump.find().cursor;
  // });
  // code to run on server at startup
});


