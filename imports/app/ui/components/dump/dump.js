/**
 * Created by Admin on 22.04.2017.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Dump} from '../../../api/webmDump';
import './dump.html';
import './dump.css';


Meteor.subscribe('files.dump.all');

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
  dump() {
    let fileCursor = Dump.find({}, {sort: {sendDate: -1}});
    let filesArray = [];
    let files = fileCursor.each();

    for (let i = files.length - 1; i > 0; i--) {
      let temp = {};
      temp.link = files[i].link().replace('localhost', 'psychosanchez.ru');
      temp.postLink = '/dump/' + files[i]._id;
      temp.type = files[i].type;
      temp.name = files[i].name;
      filesArray.push(temp);
    }

    return filesArray;
  }
});
