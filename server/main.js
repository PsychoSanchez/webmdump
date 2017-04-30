import {Meteor} from 'meteor/meteor';
import {
  MessagesDB,
  StickersDB,
  NotesDB,
  ImagesDB,
  AccountsDB
} from '../imports/app/api/database.js';
import {Dump} from '../imports/app/api/webmDump.js';
import {VK} from '../imports/app/data/appInfo';

Meteor.startup(() => {
  process.env.ROOT_URL = 'http://webmdump.ru';

  Meteor.publish('files.dump.all', function () {
    return Dump.find().cursor;
  });

  Meteor.publish('chat.public', function () {
    return MessagesDB.find({}, {skip: MessagesDB.find().count() - 15});
  });

  /**
   * Vk redirects to localhost
   * Needs deployment before
   */
  ServiceConfiguration.configurations.remove({
    service: 'vk'
  });

  /**
   * Private information
   */
  ServiceConfiguration.configurations.insert(VK);

  Accounts.onCreateUser(function (options, user) {
    console.log('onCreate', options, user);
  });
});


