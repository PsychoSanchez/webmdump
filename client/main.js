import '../imports/app/startup/index.js'
import {Meteor} from 'meteor/meteor';
import {IMAGES} from '../imports/app/data/bgData.js';

Meteor.startup(() => {
  let imageUrl = _.sample(IMAGES);
  this.$('body').css('background-image', 'url("/' + imageUrl + '")');
});
