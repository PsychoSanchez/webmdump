/**
 * Created by Admin on 21.04.2017.
 */

export class MediaPlayer {
  constructor() {
    this.playlist = [];
    this.curVideo = 0;
    this.player = document.querySelector('#media-player');
    this.playBtn = document.querySelector('#play-pause-button');
    this.stopBtn = document.querySelector('#stop-button');
    this.incVolumeBtn = document.querySelector('#volume-inc-button');
    this.decVolumeBtn = document.querySelector('#volume-dec-button');
    this.muteBtn = document.querySelector('#mute-button');
    this.replayBtn = document.querySelector('#replay-button');
    this.progressBar = document.querySelector('#progress-bar');
    this.videoUrl = document.querySelector('#video-url');
    this.addVideoBtn = document.querySelector('#add-video');
    this.playlist_list = document.querySelector('.playlist_list');
  }

  init() {
    let self = this;
    this.player.controls = false;
    this.playBtn.addEventListener('click', this.togglePlayPause.bind(this));
    this.stopBtn.addEventListener('click', this.stopPlayer.bind(this));
    this.decVolumeBtn.addEventListener('click', this.changeVolume.bind(this, false));
    this.incVolumeBtn.addEventListener('click', this.changeVolume.bind(this, true));
    this.muteBtn.addEventListener('click', this.toggleMute.bind(this));

    this.player.addEventListener('timeupdate', this.updateProgressBar.bind(this), false);
    this.player.addEventListener('play', function () {
      MediaPlayer.changeButtonType(self.playBtn, 'pause');
    }, false);
    this.player.addEventListener('pause', function () {
      MediaPlayer.changeButtonType(self.playBtn, 'play');
    }, false);
    this.player.addEventListener('volumechange', function (e) {
      if (self.player.muted) {
        MediaPlayer.changeButtonType(self.muteBtn, 'unmute');
      } else {
        MediaPlayer.changeButtonType(self.muteBtn, 'mute');
      }
    }, false);

    this.addVideoBtn.addEventListener('click', function () {
      self.addVideo(self.videoUrl.value);
    });
    this.player.addEventListener('click', function () {
      self.togglePlayPause();
    });

    this.player.addEventListener('ended', function () {
      self.nextVideo();
    });
    this.player.addEventListener('keydown', function (e) {
      if (e.keyCode === 37) {
        self.moveTime(5);
      } else if (e.keyCode === 39) {
        self.moveTime(-5);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.keyCode === 32 || e.keyCode === 13) {
        e.preventDefault();
        self.togglePlayPause();
      } else if (e.keyCode === 38) {
        self.changeVolume(true);
      } else if (e.keyCode === 40) {
        self.changeVolume(false);
      }
    });
  };

  addVideo(url) {
    this.playlist.push(url);
    this.playlist_list.innerHTML += url + '<br>';
    if (this.playlist.length === 1) {
      this.nextVideo();
    }
  };

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
    if (this.player.paused || this.player.ended) {
      this.playBtn.title = 'pause';
      this.playBtn.innerHTML = 'pause';
      this.playBtn.className = 'pause';
      this.player.play();
    } else {
      this.playBtn.title = 'play';
      this.playBtn.innerHTML = 'play';
      this.playBtn.className = 'play';
      this.player.pause();
    }
  };

  static changeButtonType(btn, value) {
    btn.title = value;
    btn.innerHTML = value;
    btn.className = value;
  };

  stopPlayer() {
    this.player.pause();
    this.player.currentTime = 0;
  };

  moveTime(delta) {
    let self = this;
    let paused = this.player.paused;
    this.player.pause();

    let newTime = this.player.currentTime - delta;
    if (newTime > this.player.duration) {
      this.nextVideo();
      return;
    }

    if (newTime < 0) {
      newTime = 0;
    }

    this.player.currentTime = newTime;
    setTimeout(function () {
      if (!paused) {
        self.player.play();
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

  changeVolume(isIncrease) {
    let volume = this.player.volume;
    if (isIncrease) {
      volume += this.player.volume === 1 ? 0 : 0.1;
    } else {
      volume -= (this.player.volume === 0 ? 0 : 0.1);
    }

    this.player.volume = parseFloat(volume).toFixed(1);
  };

  toggleMute() {
    if (this.player.muted) {
      MediaPlayer.changeButtonType(this.muteBtn, 'mute');
      this.player.muted = false;
    } else {
      MediaPlayer.changeButtonType(this.muteBtn, 'unmute');
      this.player.muted = true;
    }
  };

  replayMedia() {
    this.resetPlayer();
    this.player.play();
  };

  resetPlayer() {
    this.progressBar.value = 0;
    this.player.currentTime = 0;
    MediaPlayer.changeButtonType(this.playBtn, 'play');
  };

  updateProgressBar() {
    let duration = !isNaN(this.player.duration) ? this.player.duration : 1;
    let percentage = Math.floor((100 / duration) * this.player.currentTime);
    this.progressBar.value = percentage;
    this.progressBar.innerHTML = percentage + '% played';
  };
}

