/**
 * Created by Admin on 23.02.2017.
 */
import {Template} from 'meteor/templating';
import {MessagesDB} from '../api/messages.js';

import './chat.html';

Template.messageWindow.helpers({
  messages(){
    console.log('asdasdawe');
    return updateDB();
  }
});

function updateDB() {
  let messages = MessagesDB.find({}, {sort: {sendDate: 1}});
  messages.observeChanges({
    added: function(id, object) {
      setTimeout(function () {
        window.scrollTo(0, document.body.scrollHeight);
      },1);
    }
  });


  return messages ;
}

Template.messageInput.events({
  'submit .send-message'(event){
    event.preventDefault();
    window.scrollTo(0, document.body.scrollHeight);

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