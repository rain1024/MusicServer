/**
 *
 * Created by rain on 12/29/2015.
 */

// TODO: progressbar

var audio = $("audio")[0];
var playlist = [
  "../../Music/DeThuong-KhoiMy-3787783.mp3",
  "../../Music/DenSau-AnhKiet-UngHoangPhuc_3ev3h.mp3",
  "../../Music/ToiChoCoGaiDo-KhacViet-4098613.mp3",
  "../../Music/EmLamGiToiNay-KhacViet-3602418.mp3"
];

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

  getCurrent: function(){
    return playlist[this.current];
  }
};

MusicPlayer = {
  isPlay: false,

  player: $("audio")[0],

  play: function (link) {
    this.isPlay = true;
    if(!link){
      link = MusicRepository.getCurrent();
    }
    $("audio").attr("src", link);
    $("audio")[0].play();
  },

  previous: function () {
    var link = MusicRepository.getPrevious();
    MusicPlayer.play(link);
  },

  next: function () {
    var link = MusicRepository.getNext();
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
  if(MusicPlayer.isPlay){
    $("#play").hide();
    $("#pause").show();
  } else {
    $("#pause").hide();
    $("#play").show();
  }
};
$("#previous").click(MusicPlayer.previous);
$("#next").click(MusicPlayer.next);
$("#play").click(function(){
  MusicPlayer.play();
});
updateAudio();
setInterval(updateAudio, 1000);
