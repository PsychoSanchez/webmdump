import {Meteor} from 'meteor/meteor';
import {IMAGES} from '../imports/app/data/bgData.js';
import {Dump} from '../imports/app/api/webmDump.js';
import '../imports/app/ui/components/chat/chat.js';
import '../imports/app/ui/components/dump/dump.js';
import '../imports/app/ui/pages/garbage/post.js';
import '../imports/app/startup/index.js'
import '../imports/app/ui/layouts/logo/logo.js';

Meteor.startup(() => {
  let imageUrl = _.sample(IMAGES);
  this.$('body').css('background-image', 'url("/' + imageUrl + '")');
});

Template.logo.events({
  'click .logo'() {
    FlowRouter.go('/random');
  }
});