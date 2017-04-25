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

function createPage(cursor, pageNum) {
  let page = {};
  page.index = pageNum;
  page.files = [];
  let files = cursor.each();
  _.forEach(files, file => {
    let temp = {};
    temp.link = file.link().replace('localhost', DOMAIN);
    temp.postLink = '/shitpost/' + file._id;
    temp.type = file.type;
    temp.name = file.name;
    page.files.push(temp);
  });
  return page;
}

Template.uploadedFiles.onCreated(function () {
  this.webmsArray = new ReactiveVar([]);
  this.pages = new ReactiveVar(0);
  this.addedWebms = 0;
  this.webms = [];

  this.updatePage = (page) => {
    let webms = this.webms;
    webms[page.index] = page.files;
    this.webms = webms;
    this.webmsArray.set(webms);
  };

  this.autorun(() => {
    if (FlowRouter.current()) {
      this.cursorHandle = Meteor.subscribe('files.dump.all');
    }
  });
  // new files tracker, Actually this tracker is full of shit
  // TODO: Add server state after files uploaded and subscribe to it
  this.autorun(() => {
    // Updates every time when file added
    if (this.cursorHandle.ready()) {
      let cursor = Dump.find({}, {skip: Dump.find().count() - (WEBMS_PER_PAGE + this.addedWebms)});
      this.addedWebms += 1;
      let page = createPage(cursor, 0);
      this.updatePage(page);
      if (this.addedWebms > 1) {
        let audio = new Audio('/audio/ContactSignsIn.wav');
        audio.play();
      }
    }
  });

  // Pages tracker
  this.autorun(() => {
    if (this.cursorHandle.ready()) {
      let pageNum = this.pages.get();
      if (pageNum === 0) {
        return;
      }
      let skip = Dump.find().count() - (WEBMS_PER_PAGE * ( pageNum + 1) + this.addedWebms);
      let cursor = Dump.find({}, {skip: skip, limit: WEBMS_PER_PAGE});
      let page = createPage(cursor, pageNum);
      this.updatePage(page);
    }
  });
});

Template.uploadedFiles.onRendered(function () {
  this.scrollHandler = () => {
    if ($(window).scrollTop() + $(window).height() === $(document).height()) {
      if (Dump.find().count() > WEBMS_PER_PAGE * (this.pages.get())) {
        this.pages.set(this.pages.get() + 1);
      }
    }
  };
  $(window).scroll(this.scrollHandler);
});


Template.uploadedFiles.onDestroyed(function () {
  this.webmsArray.set([]);
  this.pages.set(0);
  this.addedWebms = 0;
  this.webms = [];
  this.cursorHandle.stop();
  $(window).off("scroll", this.scrollHandler);
});

Template.uploadedFiles.helpers({
  pages() {
    return Template.instance().webmsArray.get();
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
