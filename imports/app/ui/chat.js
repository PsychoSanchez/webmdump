/**
 * Created by Admin on 23.02.2017.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {MessagesDB} from '../api/messages.js';
import {Dump} from '../api/webmDump';

import './chat.html';


// Meteor.subscribe('files.dump.all');

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

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  }
});

Template.uploadForm.events({
  'change #fileInput': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      let upload = Dump.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          alert('File "' + fileObj.name + '" successfully uploaded');
        }
        template.currentUpload.set(false);
      });

      upload.start();
    }
  }
});

Template.uploadedFiles.helpers({
  dump: function () {
    return Dump.find().get();
  }
});

Template.uploadedFiles.events({
  'click .click'(event) {
      console.log(Dump.find().get());
  },
});