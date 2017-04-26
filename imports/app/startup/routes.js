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

FlowRouter.route('/dump/:_id', {
  name: 'shit.post',
  action(params, queryParams) {
    FlowRouter.go('/shitpost/' + params._id);
  }
});


function rollWebm() {
  let length = Dump.find().count();
  let index = Math.floor(Math.random() * length);
  let webm = Dump.find({}, {skip: index, limit: 1}).each();

  return webm[0];
}

FlowRouter.route('/random', {
  name: 'random',
  action(params){
    Meteor.subscribe('files.dump.all', () => {
      let webm = rollWebm();
      while (!webm) {
        webm = rollWebm();
      }
      BlazeLayout.render('appMain', {
        main: 'post',
        webm: {
          link: webm.link().replace('localhost', DOMAIN),
          postLink: '/shitpost/' + webm._id,
          type: webm.type,
          name: webm.name,
          autoplay: true,
          random: true
        }
      });
    });
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
            name: webm.name,
            autoplay: true
          }
        });
      } else {
        BlazeLayout.render('appMain', {main: 'notFound'});
      }
    });
  }
});