/**
 * Created by Admin on 21.04.2017.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {MediaPlayer} from './player';
import {CURRENTLY_PLAYING} from '../dump/dump';
import './mediaPlayer.less';
import './mediaPlayer.html';


Template.player.onCreated(function () {
  this.player = new MediaPlayer();

  this.playBtnClick = () => {
    let isPlaying = this.player.togglePlayPause();
    if (isPlaying) {
      CURRENTLY_PLAYING.set(Template.currentData().dump.id);
    }
  };
});

Template.player.onRendered(function () {
  this.player.init(Template.instance());
  this.autorun(() => {
    let data = Template.currentData();
    if (data.random) {
      this.player.reload();
    }
  });
  this.autorun(() => {
    console.log(CURRENTLY_PLAYING.get());
    let videoID = CURRENTLY_PLAYING.get();

    if (videoID !== Template.currentData().dump.id) {
      this.player.stop();
    }
  });
});

Template.player.events({
  'click .media-player'(e, tpl){
    Template.instance().playBtnClick();
  },
  'dblclick .media-player'(e, tpl){
    Template.instance().player.toggleFullScreen();
  },
  'keydown .media-player'(e, template){
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      Template.instance().playBtnClick();
    } else if (e.keyCode === 38) {
      e.preventDefault();
      Template.instance().player.changeVolume(true);
    } else if (e.keyCode === 40) {
      e.preventDefault();
      Template.instance().player.changeVolume(false);
    } else if (e.keyCode === 37) {
      Template.instance().player.moveTime(5);
    } else if (e.keyCode === 39) {
      Template.instance().player.moveTime(-5);
    }
  },
  'click .play-button'(e, tpl){
    Template.instance().playBtnClick();
  },
  'keydown .play-button'(e){
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      Template.instance().playBtnClick();
    }
  },
  'click .stop-button'(e, tpl){
    Template.instance().player.stop();
  },
  'click .volume-dec-button'(e, tpl){
    Template.instance().player.changeVolume(false);
  },
  'click .volume-inc-button'(e, tpl){
    Template.instance().player.changeVolume(true);
  },
  'click .mute-button'(e, tpl){
    Template.instance().player.toggleMute();
  },
  'keydown .mute-button'(e){
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      Template.instance().player.toggleMute();
    }
  },
  'click .replay-button'(e, tpl){
    Template.instance().player.replayMedia();
  },
  'input .volume-slider'(e, tpl){
    Template.instance().player.setVolume(e.target.value);
  },
  'keydown .volume-slider'(e, tpl){
    if (e.keyCode === 38) {
      e.preventDefault();
      Template.instance().player.changeVolume(true);
    } else if (e.keyCode === 40) {
      e.preventDefault();
      Template.instance().player.changeVolume(false);
    }
  },
  'input .duration'(e, tpl){
    Template.instance().player.goToTime(e.target.value);
  },
  'keydown .duration'(e, tpl){
    if (e.keyCode === 37) {
      Template.instance().player.moveTime(5);
    } else if (e.keyCode === 39) {
      Template.instance().player.moveTime(-5);
    }
  },
  'click .fullscreen-button'(e, tpl){
    Template.instance().player.toggleFullScreen();
  },

  'keydown .fullscreen-button'(e, tpl){
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      Template.instance().player.toggleFullScreen();
    }
  }

});

