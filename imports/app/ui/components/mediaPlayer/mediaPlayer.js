/**
 * Created by Admin on 21.04.2017.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {MediaPlayer} from './player';
import './mediaPlayer.less';
import './mediaPlayer.html';


Template.player.onCreated(function () {
  this.player = new ReactiveVar(new MediaPlayer());
});

Template.player.onRendered(function () {
  let player = Template.instance().player.get();
  player.init(Template.instance());
  this.autorun(() => {
    let data = Template.currentData();
    if (data.random) {
      this.player.get().reload();
    }
  });
});

Template.player.events({
  'click .media-player'(e, tpl){
    let player = Template.instance().player.get();
    player.togglePlayPause();
  },
  'dblclick .media-player'(e, tpl){
    let player = Template.instance().player.get();
    player.toggleFullScreen();
  },
  'keydown .media-player'(e, template){
    let player = Template.instance().player.get();
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      player.togglePlayPause();
    } else if (e.keyCode === 38) {
      e.preventDefault();
      player.changeVolume(true);
    } else if (e.keyCode === 40) {
      e.preventDefault();
      player.changeVolume(false);
    } else if (e.keyCode === 37) {
      player.moveTime(5);
    } else if (e.keyCode === 39) {
      player.moveTime(-5);
    }
  },
  'click .play-button'(e, tpl){
    let player = Template.instance().player.get();
    player.togglePlayPause();
  },
  'keydown .play-button'(e){
    let player = Template.instance().player.get();
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      player.togglePlayPause();
    }
  },
  'click .stop-button'(e, tpl){
    let player = Template.instance().player.get();
    player.stop();
  },
  'click .volume-dec-button'(e, tpl){
    let player = Template.instance().player.get();
    player.changeVolume(false);
  },
  'click .volume-inc-button'(e, tpl){
    let player = Template.instance().player.get();
    player.changeVolume(true);
  },
  'click .mute-button'(e, tpl){
    let player = Template.instance().player.get();
    player.toggleMute();
  },
  'keydown .mute-button'(e){
    let player = Template.instance().player.get();
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      player.toggleMute();
    }
  },
  'click .replay-button'(e, tpl){
    let player = Template.instance().player.get();
    player.replayMedia();
  },
  'input .volume-slider'(e, tpl){
    let player = Template.instance().player.get();
    player.setVolume(e.target.value);
  },
  'keydown .volume-slider'(e, tpl){
    let player = Template.instance().player.get();
    if (e.keyCode === 38) {
      e.preventDefault();
      player.changeVolume(true);
    } else if (e.keyCode === 40) {
      e.preventDefault();
      player.changeVolume(false);
    }
  },
  'input .duration'(e, tpl){
    let player = Template.instance().player.get();
    player.goToTime(e.target.value);
  },
  'keydown .duration'(e, tpl){
    let player = Template.instance().player.get();
    if (e.keyCode === 37) {
      player.moveTime(5);
    } else if (e.keyCode === 39) {
      player.moveTime(-5);
    }
  },
  'click .fullscreen-button'(e, tpl){
    let player = Template.instance().player.get();
    player.toggleFullScreen();
  },

  'keydown .fullscreen-button'(e, tpl){
    let player = Template.instance().player.get();
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      player.toggleFullScreen();
    }
  }

});