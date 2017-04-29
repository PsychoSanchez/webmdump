/**
 * Created by Admin on 21.04.2017.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {MediaPlayer} from './player';
import {CURRENTLY_PLAYING} from '../../pages/feed/feed';
import './mediaPlayer.less';
import './mediaPlayer.html';


Template.player.onCreated(function () {
  this.player = new MediaPlayer();

  /**
   * Emit event to feed page, that play button pressed
   */
  this.playBtnClick = () => {
    let isPlaying = this.player.togglePlayPause();
    if (isPlaying) {
      CURRENTLY_PLAYING.set(Template.currentData().video.id);
    }
  };
});

Template.player.onRendered(function () {
  this.player.init(Template.instance());

  /**
   * New video from /random loaded
   */
  let updateRandomVideo = () => {
    let data = Template.currentData();
    if (data.random) {
      this.player.reload();
    }
  };
  this.autorun(updateRandomVideo);

  /**
   *  New video from /feed loaded
   */
  let currentlyPlayingUpdate = () => {
    let videoID = CURRENTLY_PLAYING.get();
    let videoInfo = Template.currentData().video;
    if (!videoInfo) {
      return;
    }

    if (videoID !== videoInfo.id) {
      this.player.stop();
    }
  };
  this.autorun(currentlyPlayingUpdate);
});

Template.player.events({
  'click .media-player'(e, tpl){
    tpl.playBtnClick();
  },
  'dblclick .media-player'(e, tpl){
    tpl.player.toggleFullScreen();
  },
  'keydown .media-player'(e, tpl){
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      tpl.playBtnClick();
    } else if (e.keyCode === 38) {
      e.preventDefault();
      tpl.player.changeVolume(true);
    } else if (e.keyCode === 40) {
      e.preventDefault();
      tpl.player.changeVolume(false);
    } else if (e.keyCode === 37) {
      tpl.player.moveTime(5);
    } else if (e.keyCode === 39) {
      tpl.player.moveTime(-5);
    }
  },
  'click .play-button'(e, tpl){
    tpl.playBtnClick();
  },
  'keydown .play-button'(e, tpl){
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      tpl.playBtnClick();
    }
  },
  'click .stop-button'(e, tpl){
    tpl.player.stop();
  },
  'click .volume-dec-button'(e, tpl){
    tpl.player.changeVolume(false);
  },
  'click .volume-inc-button'(e, tpl){
    tpl.player.changeVolume(true);
  },
  'click .mute-button'(e, tpl){
    tpl.player.toggleMute();
  },
  'keydown .mute-button'(e, tpl){
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      tpl.player.toggleMute();
    }
  },
  'click .replay-button'(e, tpl){
    tpl.player.replayMedia();
  },
  'input .volume-slider'(e, tpl){
    tpl.player.setVolume(e.target.value);
  },
  'keydown .volume-slider'(e, tpl){
    if (e.keyCode === 38) {
      e.preventDefault();
      tpl.player.changeVolume(true);
    } else if (e.keyCode === 40) {
      e.preventDefault();
      tpl.player.changeVolume(false);
    }
  },
  'input .duration'(e, tpl){
    tpl.player.goToTime(e.target.value);
  },
  'keydown .duration'(e, tpl){
    if (e.keyCode === 37) {
      tpl.player.moveTime(5);
    } else if (e.keyCode === 39) {
      tpl.player.moveTime(-5);
    }
  },
  'click .fullscreen-button'(e, tpl){
    tpl.player.toggleFullScreen();
  },
  'keydown .fullscreen-button'(e, tpl){
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
      tpl.player.toggleFullScreen();
    }
  }

});

