/**
 * Created by Admin on 22.04.2017.
 */
import {Dump} from '../api/webmDump.js';
import {DOMAIN} from '../data/localConfig';

FlowRouter.route('/', {
  name: 'main',
  action(params, queryParams) {
    BlazeLayout.render('appMain', {main: 'home'});
  }
});

FlowRouter.route('/shitpost/:_id', {
  name: 'shit.post',
  action(params, queryParams) {
    Meteor.subscribe('files.dump.all', () => {
      let webm = Dump.findOne({_id: params._id});
      if (webm) {
        BlazeLayout.render('appMain', {
          main: 'post',
          webm: {
            link: webm.link().replace('localhost', DOMAIN),
            type: webm.type,
            name: webm.name
          }
        });
      } else {
        BlazeLayout.render('appMain', {main: 'notFound'});
      }
    });
  }
});