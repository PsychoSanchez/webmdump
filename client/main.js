import '../imports/app/startup/index.js'
import {Meteor} from 'meteor/meteor';
import {IMAGES} from '../imports/app/data/bgData.js';

Meteor.startup(() => {
  // Random background when joining to site
  let imageUrl = _.sample(IMAGES);
  this.$('body').css('background-image', 'url("/' + imageUrl + '")');


  // Update page title when routing
  Tracker.autorun(function () {
    document.title = Session.get("DocumentTitle");
  });
});
