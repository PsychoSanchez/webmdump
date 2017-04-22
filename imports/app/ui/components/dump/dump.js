/**
 * Created by Admin on 22.04.2017.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Dump} from '../../../api/webmDump';
import './dump.html';
import './dump.less';
import {DOMAIN} from '../../../data/localConfig'


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

Template.uploadedFiles.onCreated(function() {
  this.webmsArray = new ReactiveVar(false);
});

Template.uploadedFiles.helpers({
  dump() {
    let fileCursor = Dump.find({}, {sort: {sendDate: -1}});
    let filesArray = [];
    let files = fileCursor.each();
    _.forEach(files, file=>{
      let temp = {};
      temp.link = file.link().replace('localhost', DOMAIN);
      temp.postLink = '/dump/' + file._id;
      temp.type = file.type;
      temp.name = file.name;
      filesArray.push(temp);
    });
    Template.instance().webmsArray.set(filesArray);
    return filesArray;
  }
});

Template.uploadedFiles.events({
  // 'click video': function (e, template) {
  //   // TODO: instead of reroutong load video after preview
  //   let webms = template.webmsArray.get();
  //   let path = _.find(webms, webm =>{
  //     return webm.link === e.toElement.currentSrc;
  //   }).postLink;
  //   FlowRouter.go(path)
  // }
});
