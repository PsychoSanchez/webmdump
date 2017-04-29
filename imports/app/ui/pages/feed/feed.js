/**
 * Created by Admin on 22.04.2017.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Dump} from '../../../api/webmDump';
import './feed.html';
import '../../pages/feed/feed.less';
import {DOMAIN} from '../../../data/localConfig'
export const CURRENTLY_PLAYING = new ReactiveVar('');
const WEBMS_PER_PAGE = 10;

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
    temp.id = file._id;
    page.files.push(temp);
  });
  return page;
}

Template.feedLine.onCreated(function () {
  this.webmsArray = new ReactiveVar([]);
  this.pages = new ReactiveVar(0);
  this.localPagesArray = [];
  this.newVideos = 0;

  /**
   * Update selected page
   * @param page page with information about videos
   */
  this.updateLayout = (page) => {
    let pages = this.localPagesArray;
    pages[page.index] = page.files;
    this.localPagesArray = pages;
    this.webmsArray.set(pages);
  };

  /**
   * Subscribe to database
   * EveryTime when we leave page handle destroy
   */
  this.subscribeToDb = ()=>{
    if (FlowRouter.current()) {
      this.cursorHandle = Meteor.subscribe('files.dump.all');
    }
  };
  this.autorun(this.subscribeToDb);

  // new files tracker, Actually this tracker is full of shit
  // TODO: Add server state after files uploaded and subscribe to it
  /**
   * Tracker that updates first page and load new videos
   */
  this.loadNewVideo = ()=>{
    // Updates every time when file added
    if (this.cursorHandle.ready()) {
      let cursor = Dump.find({}, {skip: Dump.find().count() - (WEBMS_PER_PAGE + this.newVideos)});
      this.newVideos += 1;
      let page = createPage(cursor, 0);
      this.updateLayout(page);
      if (this.newVideos > 1) {
        let audio = new Audio('/audio/ContactSignsIn.wav');
        audio.play();
      }
    }
  };
  this.autorun(this.loadNewVideo);

  /**
   * Pages tracker
   * Called when new page loaded
   */
  this.loadMore = () =>{
    if (this.cursorHandle.ready()) {
      let pageNum = this.pages.get();
      if (pageNum === 0) {
        return;
      }
      let skip = Dump.find().count() - (WEBMS_PER_PAGE * ( pageNum + 1) + this.newVideos);
      let cursor = Dump.find({}, {skip: skip, limit: WEBMS_PER_PAGE});
      let page = createPage(cursor, pageNum);
      this.updateLayout(page);
    }
  };
  this.autorun(this.loadMore);

});

Template.feedLine.onRendered(function () {
  this.scrollHandler = () => {
    if ($(window).scrollTop() + $(window).height() === $(document).height()) {
      if (Dump.find().count() > WEBMS_PER_PAGE * (this.pages.get())) {
        this.pages.set(this.pages.get() + 1);
      }
    }
  };
  $(window).scroll(this.scrollHandler);
});

Template.feedLine.onDestroyed(function () {
  this.webmsArray.set([]);
  this.pages.set(0);
  this.newVideos = 0;
  this.localPagesArray = [];
  this.cursorHandle.stop();
  $(window).off("scroll", this.scrollHandler);
});

Template.feedLine.helpers({
  pages() {
    return Template.instance().webmsArray.get();
  }
});