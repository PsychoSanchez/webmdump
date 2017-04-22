import {Meteor} from 'meteor/meteor';
import {IMAGES} from '../imports/app/data/bgData.js';
import {Dump} from '../imports/app/api/webmDump.js';
import '../imports/app/ui/components/chat/chat.js';
import '../imports/app/ui/components/dump/dump.js';
import '../imports/app/ui/pages/garbage/post.js';
import '../imports/app/startup/index.js'

Meteor.startup(() => {
  let imageUrl = _.sample(IMAGES);
  this.$('body').css('background-image', 'url("/' + imageUrl + '")');
});