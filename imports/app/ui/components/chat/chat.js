/**
 * Created by Admin on 23.02.2017.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {MessagesDB} from '../../../api/messages.js';
import './chat.css';
import './chat.html';


Meteor.subscribe('files.dump.all');

Meteor.startup(() => {
  let messages = MessagesDB.find({}, {sort: {sendDate: -1}, limit: 15});
  messages.observeChanges({
    addedBefore: function (id, object) {
      // setTimeout(function () {
      //   // console.log(Template.instance())
      //   // T.scrollTo(0, document.body.scrollHeight);
      // },1);
    }
  });
});

Template.messageWindow.helpers({
  messages(){
    return updateDB();
  }
});

function updateDB() {
  return MessagesDB.find({}, {skip: MessagesDB.find().count() - 15});
}

Template.messageInput.events({
  'submit .send-message'(event){
    event.preventDefault();
    // window.scrollTo(0, document.body.scrollHeight);

    let text = event.target.message.value;
    let name = event.target.name.value;

    MessagesDB.insert({
      user: name ? name : "Anon",
      message: text,
      sendDate: new Date()
    });

    window.scrollTo(0, document.body.scrollHeight);
    event.target.message.value = '';
    return false;
  }
});
Template.chat.onCreated(function () {
  this.visibility = new ReactiveVar(!!Session.get('chat-collapse'));
});

Template.chat.onRendered(function () {
  Chat.setCollapsed(Session.get('chat-collapse'));
});

Template.chat.events({
  'click .toggle-chat-btn'(event, template){
    let vis = template.visibility.get();
    Chat.setCollapsed(!vis);
    template.visibility.set(!vis);
  }
});

class Chat{
  static setCollapsed(collapsed){
    console.log(collapsed);
    let action = (collapsed) ? 'show' : 'hide';
    $('.chat-block')[action]();
    $('.toggle-chat-btn').html((collapsed) ? 'Show' : 'Hide');
    Session.set('chat-collapse', collapsed);
  }
}