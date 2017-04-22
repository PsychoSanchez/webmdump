/**
 * Created by Admin on 22.04.2017.
 */

const PLAYBTN_STATES = {PLAY: 'css-play', PAUSE: 'css-pause'};
const MUTEBTN_STATES = {MUTE: 'css-volume-off', UNMUTE: 'css-volume-on'};
const VOLUME_CHANGE_STEP = 0.05;

export class MediaPlayer {
  constructor() {
    this.playlist = [];
    this.curVideo = 0;

    // Initializing values
    this.onplaying = false;
    this.onpause = true;
  }

  static changeButtonState({button, removeClass, addClass, title}) {
    // button.title = title;
    // button.innerHTML = title;
    $(button).removeClass(removeClass).addClass(addClass);
  };

  /**
   * Initialize all inner events and elements
   * @param container
   */
  init(container) {
    this.player = container.find('.media-player');
    this.playBtn = container.find('.play-button');
    this.stopBtn = container.find('.stop-button');
    this.incVolumeBtn = container.find('.volume-inc-button');
    this.decVolumeBtn = container.find('.volume-dec-button');
    this.volumeSlider = container.find('.volume-slider');
    this.muteBtn = container.find('.mute-button');
    this.replayBtn = container.find('.replay-button');
    this.progressBar = container.find('.duration');
    this.initEvents();
  };

  /**
   * Init all inner events
   */
  initEvents() {
    this.player.controls = false;

    this.player.addEventListener('loadeddata', () => {
      this.volumeSlider.value = this.player.volume * 100;
    });
    this.player.addEventListener('timeupdate', () => {
      this.updateProgressBar();
    });
    this.player.addEventListener('play', () => {
      this.volumeSlider.value = this.player.volume * 100;
      MediaPlayer.changeButtonState({
        button: this.playBtn,
        removeClass: PLAYBTN_STATES.PLAY,
        addClass: PLAYBTN_STATES.PAUSE,
        title: 'Pause'
      });
    }, false);
    this.player.addEventListener('pause', () => {
      // On video pause toggle values
      this.onplaying = false;
      this.onpause = true;

      MediaPlayer.changeButtonState({
        button: this.playBtn,
        removeClass: PLAYBTN_STATES.PAUSE,
        addClass: PLAYBTN_STATES.PLAY,
        title: 'Play'
      });
    }, false);
    this.player.addEventListener('volumechange', () => {
      this.setVolume(this.player.volume * 100);
    }, false);

    this.player.addEventListener('ended', () => {
      this.togglePlayPause();
      // self.nextVideo();
    });
    // On video playing toggle values
    this.player.addEventListener('playing', () => {
      this.onplaying = true;
      this.onpause = false;
    });

  }

  /**
   * Play function
   */
  play() {
    if (this.player.paused && !this.onplaying) {
      this.player.play();
    }
  }

  /**
   * Pause function
   */
  pause() {
    if (!this.player.paused && !this.onpause) {
      this.player.pause();
    }
  }

  loadVideo(url) {
    let self = this;
    let file = url.split('.');
    let ext = file[file.length - 1];
    if (this.canPlayMedia(ext)) {
      this.resetPlayer();
      this.player.src = MEDIA_FOLDER + url;
      this.player.load();
      setTimeout(function () {
        self.player.play();
      }, 0);
    } else {
      console.log('>> Error while loading video: Unsupported format');
    }
  };

  canPlayMedia(ext) {
    let ableToPlay = this.player.canPlayType('video/' + ext);
    return !(ableToPlay === '');
  };

  togglePlayPause() {
    let state = this.player.paused || this.player.ended;
    if (state) {
      this.play();
    } else {
      this.pause();
    }

    MediaPlayer.changeButtonState({
      button: this.playBtn,
      removeClass: (state) ? PLAYBTN_STATES.PLAY : PLAYBTN_STATES.PAUSE,
      addClass: (!state) ? PLAYBTN_STATES.PLAY : PLAYBTN_STATES.PAUSE,
      title: (state) ? 'Pause' : 'Play'
    });
  };


  stop() {
    this.pause();
    this.player.currentTime = 0;
  };

  goToTime(value) {
    let paused = this.player.paused;
    this.pause();
    this.player.currentTime = this.player.duration / 100 * value;
    setTimeout(() => {
      if (!paused) {
        this.play();
      }
    }, 0);
  }

  moveTime(delta) {
    let paused = this.player.paused;
    this.pause();
    let newTime = this.player.currentTime - delta;
    // if (newTime > this.player.duration) {
    //   this.nextVideo();
    //   return;
    // }

    if (newTime < 0) {
      newTime = 0;
    }

    this.player.currentTime = newTime;
    setTimeout(() => {
      if (!paused) {
        this.play();
      }
    }, 0);
  };

  nextVideo() {
    this.curVideo++;
    if (this.curVideo >= this.playlist.length) {
      this.curVideo = 0;
    }
    this.loadVideo(this.playlist[this.curVideo]);
  };

  /**
   * Sets current videoplayer volume
   * @param value
   */
  setVolume(value) {
    this.player.volume = parseFloat(value / 100);
    this.volumeSlider.value = value;
    this.setMute(this.player.muted);
  }

  /**
   * Increase or decrease volume by given value
   * @param isIncrease
   */
  changeVolume(isIncrease) {
    let volume = this.player.volume;
    if (isIncrease) {
      volume += (this.player.volume >= 1) ? 0 : VOLUME_CHANGE_STEP;
      if (volume > 1) {
        volume = 1;
      }
    } else {
      volume -= (this.player.volume <= 0 ? 0 : VOLUME_CHANGE_STEP);
      if (volume < 0) {
        volume = 0;
      }
    }
    this.player.volume = volume;
  };

  toggleMute() {
    this.setMute(!this.player.muted);
    this.changeVolume(this.player.muted);
  };

  setMute(mute) {
    this.player.muted = mute;
    MediaPlayer.changeButtonState({
      button: this.muteBtn,
      removeClass: (mute) ? MUTEBTN_STATES.UNMUTE : MUTEBTN_STATES.MUTE,
      addClass: (!mute) ? MUTEBTN_STATES.UNMUTE : MUTEBTN_STATES.MUTE,
      title: (!mute) ? 'Mute' : 'Unmute'
    });
  }

  replayMedia() {
    this.resetPlayer();
    this.play();
  };

  resetPlayer() {
    this.progressBar.value = 0;
    this.player.currentTime = 0;
    MediaPlayer.changeButtonState({
      button: this.playBtn,
      removeClass: PLAYBTN_STATES.PAUSE,
      addClass: PLAYBTN_STATES.PLAY,
      title: 'Play'
    });
  };

  updateProgressBar() {
    let duration = !isNaN(this.player.duration) ? this.player.duration : 1;
    let percentage = Math.floor((100 / duration) * this.player.currentTime);
    this.progressBar.value = percentage;
  };
}