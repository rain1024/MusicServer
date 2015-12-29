/**
 *
 * Created by rain on 12/29/2015.
 */

// TODO: random

var audio = $("audio")[0];
var playlist = [
  {
    "link": "../../Music/DeThuong-KhoiMy-3787783.mp3",
  },
  {
    "link": "../../Music/DenSau-AnhKiet-UngHoangPhuc_3ev3h.mp3",
  },
  {
    "link": "../../Music/ToiChoCoGaiDo-KhacViet-4098613.mp3",
  },
  {
    "link": "../../Music/EmLamGiToiNay-KhacViet-3602418.mp3"
  }
];

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
    return playlist[this.current].link;
  },

  getNext: function () {
    this.current = (this.current + 1) % playlist.length;
    return playlist[this.current].link;
  },

  getCurrent: function () {
    return playlist[this.current].link;
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

  /**
   * 0: none
   * 1: all
   * 2: one
   */
  repeatStatus: REPEAT_STATUS.NONE,

  player: $("audio")[0],

  play: function (link) {
    this.isPlay = true;
    if (!link) {
      link = MusicRepository.getCurrent();
    }
    $("audio").attr("src", link);
    $("audio")[0].play();
  },

  previous: function () {
    var link;
    if(MusicPlayer.repeatStatus == REPEAT_STATUS.ONE){
      link = MusicRepository.getCurrent();
    } else {
      link = MusicRepository.getPrevious();
    }
    MusicPlayer.play(link);
  },

  next: function () {
    var link;
    if(MusicPlayer.repeatStatus == REPEAT_STATUS.ONE){
      link = MusicRepository.getCurrent();
    } else {
      link = MusicRepository.getNext();
    }
    MusicPlayer.play(link);
  }
};

audio.addEventListener('ended', function (e) {
  var link = MusicRepository.getNext();
  MusicPlayer.play(link);
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
};
$("#previous").click(MusicPlayer.previous);
$("#next").click(MusicPlayer.next);
$("#play").click(function () {
  MusicPlayer.play();
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

updateAudio();
setInterval(updateAudio, 100);
