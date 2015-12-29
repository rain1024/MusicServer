/**
 *
 * Created by rain on 12/29/2015.
 */


var audio = $("audio")[0];
var playlist = [
  "../../Music/DeThuong-KhoiMy-3787783.mp3",
  "../../Music/DenSau-AnhKiet-UngHoangPhuc_3ev3h.mp3"
];

MusicRepository = {
  current: 0,

  getPrevious: function(){
    this.current = (this.current + playlist.length - 1) % playlist.length;
    return playlist[this.current];
  },

  getNext: function () {
    this.current = (this.current + 1) % playlist.length;
    return playlist[this.current];
  }
};

MusicPlayer = {
  player: $("audio")[0],

  play: function (link) {
    $("audio").attr("src", link);
    $("audio")[0].play();
  },
  previous: function(){
    var link = MusicRepository.getPrevious();
    MusicPlayer.play(link);
  }
};

audio.addEventListener('ended', function (e) {
  var link = MusicRepository.getNext();
  MusicPlayer.play(link);
});

var updateAudio = function () {
  //if (isLoop) {
  //  $("audio").attr("loop");
  //} else {
  //  $("audio").removeAttr("loop");
  //}
};

$("#previous").click(MusicPlayer.previous);

setInterval(updateAudio, 1000);
