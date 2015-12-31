/**
 *
 * Created by rain on 12/29/2015.
 */

var audio = $("audio")[0];

var playlist = [
  {
    "title": "Dễ Thương",
    "author": "Khởi My",
    "link": "../../Music/DeThuong-KhoiMy-3787783.mp3",
  },
  {
    "title": "Đến Sau",
    "author": "Ưng Hoàng Phúc",
    "link": "../../Music/DenSau-AnhKiet-UngHoangPhuc_3ev3h.mp3",
  },
  {
    "title": "Tội Cho Cô Gái Đó",
    "author": "Khắc Việt",
    "link": "../../Music/ToiChoCoGaiDo-KhacViet-4098613.mp3",
  }
];

var serviceIP = "http://127.0.0.1";
var servicePort = "8484";
var serviceURL = sprintf("%s:%s/api", serviceIP, servicePort);
$.get(sprintf("%s/songs/", serviceURL))
  .then(function(data){
    if(data){
      playlist = data;
    }
  });
$(function () {

  var MusicUI = $(".dial").knob({
    'fgColor': '#DF193C',
    'width': '400',
    'height': '400',
    'displayInput': false,

    change: function(value){
      $("audio")[0].currentTime = value / 100 * audio.duration;
    }
  });
});

MusicRepository = {
  current: 0,

  getPrevious: function () {
    this.current = (this.current + playlist.length - 1) % playlist.length;
    return playlist[this.current];
  },

  getNext: function () {
    this.current = (this.current + 1) % playlist.length;
    return playlist[this.current];
  },

  getCurrent: function () {
    return playlist[this.current];
  },

  getRandom: function(){
    this.current = Math.floor((Math.random() * playlist.length));
    return playlist[this.current];
  }
};
REPEAT_STATUS = {
  NONE: 0,
  ALL: 1,
  ONE: 2
};

MusicPlayer = {

  isPlay: false,

  isRandom: false,

  isPausePress: false,

  /**
   * 0: none
   * 1: all
   * 2: one
   */
  repeatStatus: REPEAT_STATUS.NONE,

  player: $("audio")[0],

  pause: function(){
    MusicPlayer.isPlay = false;
    MusicPlayer.isPausePress = true;
    $("audio")[0].pause();
  },

  play: function (link) {
    if(MusicPlayer.isPausePress){
      MusicPlayer.isPausePress = false;
    } else {
      this.isPlay = true;
      $("audio")[0].pause();
      if (!link) {
        link = MusicRepository.getCurrent().link;
      }
      $("audio").attr("src", link);
      console.log("Play ", link);
    }
    $("audio")[0].play();
  },

  previous: function () {
    var link;
    var song;
    if(MusicPlayer.isRandom){
      song = MusicRepository.getRandom();
    }
    if(MusicPlayer.repeatStatus == REPEAT_STATUS.ONE){
      song = MusicRepository.getCurrent();
    } else {
      song = MusicRepository.getPrevious();
    }
    link = song.link;
    MusicPlayer.play(link);
  },

  next: function () {
    var song;
    var link;
    if(MusicPlayer.isRandom){
      song = MusicRepository.getRandom();
    }
    if(MusicPlayer.repeatStatus == REPEAT_STATUS.ONE){
      song = MusicRepository.getCurrent();
    } else {
      song = MusicRepository.getNext();
    }
    link = song.link;
    MusicPlayer.play(link);
  }
};

audio.addEventListener('ended', function (e) {
  MusicPlayer.next();
});

var updateAudio = function () {
  var audio = $("audio")[0]
  var value = Math.floor((100 / audio.duration) * audio.currentTime);
  $('.dial').val(value).trigger('change');
  // update status
  if (MusicPlayer.isPlay) {
    $("#play").hide();
    $("#pause").show();
  } else {
    $("#pause").hide();
    $("#play").show();
  }

  if(MusicPlayer.repeatStatus == REPEAT_STATUS.NONE){
    $("#repeat-all").hide();
    $("#repeat-one").hide();
    $("#repeat-none").show();
  }

  if(MusicPlayer.repeatStatus == REPEAT_STATUS.ALL){
    $("#repeat-one").hide();
    $("#repeat-none").hide();
    $("#repeat-all").show();
  }

  if(MusicPlayer.repeatStatus == REPEAT_STATUS.ONE){
    $("#repeat-none").hide();
    $("#repeat-all").hide();
    $("#repeat-one").show();
  }

  if(MusicPlayer.isRandom){
    $("#random-deactive").hide();
    $("#random-active").show();
  }

  if(!MusicPlayer.isRandom){
    $("#random-active").hide();
    $("#random-deactive").show();
  }

  $("#title").text(MusicRepository.getCurrent().title);
  $("#author").text(MusicRepository.getCurrent().author);

  try {
    var current_minute = (audio.currentTime / 60);
    var current_second = (audio.currentTime % 60);
    var duration_minute, duration_second;
    if(audio.duration > 0){
      duration_minute = (audio.duration / 60);
      duration_second = (audio.duration % 60);
    } else {
      duration_minute = 0;
      duration_second = 0;
    }
    var textProgress = sprintf("%02d:%02d | %02d:%02d", current_minute, current_second, duration_minute, duration_second);
    $("#text-progress").text(textProgress);
  } catch(e){ };
};

$("#previous").click(MusicPlayer.previous);
$("#next").click(MusicPlayer.next);
$("#play").click(function () {
  MusicPlayer.play();
});

$("#pause").click(function () {
  MusicPlayer.pause();
});

$("#repeat-one").click(function(){
  MusicPlayer.repeatStatus = REPEAT_STATUS.NONE;
});

$("#repeat-none").click(function(){
  MusicPlayer.repeatStatus = REPEAT_STATUS.ALL;
});

$("#repeat-all").click(function(){
  MusicPlayer.repeatStatus = REPEAT_STATUS.ONE;
});

$("#random-active").click(function(){
  MusicPlayer.isRandom = false;
});

$("#random-deactive").click(function(){
  MusicPlayer.isRandom = true;
});

updateAudio();
setInterval(updateAudio, 100);
