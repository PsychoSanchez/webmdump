import {Meteor} from 'meteor/meteor';
import {
  MessagesDB,
  StickersDB,
  NotesDB,
  ImagesDB,
  AccountsDB
} from '../imports/app/api/database.js';
import {Dump} from '../imports/app/api/webmDump.js';

Meteor.startup(() => {
  Meteor.publish('files.dump.all', function () {
    return Dump.find().cursor;
  });

  Meteor.publish('chat.public', function () {
    return MessagesDB.find({}, {skip: MessagesDB.find().count() - 15});
  });
});


