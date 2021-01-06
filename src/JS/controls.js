export default class SceneControls extends Phaser.Scene {
  //navigator.addMediaDevice
  constructor(){
    super({ key: "SceneControls" });
  }
  preload(){
    /* let video = this.getMedia({ audio: false, video: true })
    this.load.video('player', video); */
     //  No properties at all means we'll create a video stream from a webcam
    
  }
  async create(){
    try {
      const constraints = {
        video: {width: window.innerWidth * 0.1, height: window.innerHeight * 0.1},
        audio: false,
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      var video = document.createElement("video");
      video.playsinline = true;
      video.srcObject = mediaStream;
      video.width = 120;
      video.height = 140;
      video.autoplay = true;
  
      const phaserVideo = new Phaser.GameObjects.Video(this, 100, 100);
      phaserVideo.width = 120;
      phaserVideo.height = 140;
      
      console.log(phaserVideo.body);
      phaserVideo.video = video;
      this.add.existing(phaserVideo);
    } catch (e) {
      console.log("error", e.message, e.name);
    }
    /*
    let vid = this.add.video(200, 200, 'player');
    vid.play(true);
    this.sfx = {
      btnOver: this.sound.add("sndBtnOver"),
      btnDown: this.sound.add("sndBtnDown")
    };

    this.btnPlay = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "sprBtnPlay"
    );
    this.btnPlay.setInteractive();

    this.btnPlay.on("pointerover", function() {
      this.btnPlay.setTexture("sprBtnPlayHover"); // set the button texture to sprBtnPlayHover
      this.sfx.btnOver.play(); // play the button over sound
    }, this); */
  }
  update(){

  }
}

