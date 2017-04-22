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
});

Template.player.events({
  'keydown .media-player'(e, template){
    let player = Template.instance().player.get();
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      player.togglePlayPause();
    } else if (e.keyCode === 38) {
      player.changeVolume(true);
    } else if (e.keyCode === 40) {
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
  'click .replay-button'(e, tpl){
    let player = Template.instance().player.get();
    player.replayMedia();
  },
  'click .media-player'(e, tpl){
    let player = Template.instance().player.get();
    player.togglePlayPause();
  },
  'input .volume-slider'(e, tpl){
    let player = Template.instance().player.get();
    player.setVolume(e.target.value);
  },
  'input .duration'(e, tpl){
    let player = Template.instance().player.get();
    player.goToTime(e.target.value);
  }
});