/**
 * Created by Admin on 22.04.2017.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Dump} from '../../../api/webmDump';
import './dump.html';
import './dump.less';
import {DOMAIN} from '../../../data/localConfig'
const WEBMS_PER_PAGE = 10;

const HANDLE = Meteor.subscribe('files.dump.all');

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

Template.uploadedFiles.onCreated(function () {
  this.webmsArray = new ReactiveVar(false);
  this.pages = new ReactiveVar(1);
  this.isReady = new ReactiveVar(false);
  Tracker.autorun(() => {
    Template.instance().isReady.set(HANDLE.ready());
    console.log(`Handle is ${Template.instance().isReady.get() ? 'ready' : 'not ready'}`);
  });
});

Template.uploadedFiles.helpers({
  dump() {
    let isReady = Template.instance().isReady.get();
    // if(isReady){
    let filesArray = [];
    let pages = Template.instance().pages.get();
    let fileCursor = Dump.find({}, {skip: Dump.find().count() - (WEBMS_PER_PAGE * pages)});
    // let fileCursor = Dump.find({}, {limit: (WEBMS_PER_PAGE * pages)});
    let files = fileCursor.each();
    _.forEach(files, file => {
      let temp = {};
      temp.link = file.link().replace('localhost', DOMAIN);
      temp.postLink = '/shitpost/' + file._id;
      temp.type = file.type;
      temp.name = file.name;
      filesArray.push(temp);
    });
    Template.instance().webmsArray.set(filesArray);
    return filesArray;
    // }
  }
});

Template.uploadedFiles.events({
  'click video': function (e, template) {
    // TODO: instead of reroutong load video after preview
    // let webms = template.webmsArray.get();
    // let path = _.find(webms, webm =>{
    //   return webm.link === e.toElement.currentSrc;
    // }).postLink;
    // FlowRouter.go(path)
  }
});
