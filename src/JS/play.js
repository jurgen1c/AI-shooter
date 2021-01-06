import Player from './entities/player';
//import ml5 from 'ml5';
export default class ScenePlay extends Phaser.Scene {
  constructor(){
    super({ key: "ScenePlay" });
  }
  preload(){
    //this.stream = this.getMedia();
  }

  create(){
    this.player = new Player(
      this,
      200,
      400,
      "Player",
    );
    /* this.stream = async () => {
      try {
        const constraints = {
          video: {width: 100, height: 100},
          audio: false,
        };
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        let video = document.createElement("video");
        video.playsinline = true;
        video.srcObject = mediaStream;
        video.width = constraints.video.width;
        video.height = constraints.video.height;
        video.autoplay = true;
  
        this.player = new Player(
          this,
          this.game.config.width * 0.5,
          this.game.config.height * 0.5,
          "playerStream",
          this.stream
        );
        //this.add.existing(phaserVideo);
      } catch (e) {
        console.log("error", e.message, e.name);
      }
    }
    if (this.stream){
      
    } */
    
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.playerLasers = this.add.group();

  }

  update(){
    if (!this.player.getData("isDead")) {
      this.player.update();
      /* if (this.keyW.isDown) {
        this.player.moveUp();
      }
      else if (this.keyS.isDown) {
        this.player.moveDown();
      } */
      if (this.keyA.isDown) {
        this.player.moveLeft();
      }
      else if (this.keyD.isDown) {
        this.player.moveRight();
      }
    
      if (this.keySpace.isDown) {
        this.player.setData("isShooting", true);
      }
      else {
        this.player.setData("timerShootTick", this.player.getData("timerShootDelay") - 1);
        this.player.setData("isShooting", false);
      }
    }
  }
  async getMedia(){
    try {
      const constraints = {
        video: {width: 100, height: 100},
        audio: false,
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      let video = document.createElement("video");
      video.playsinline = true;
      video.srcObject = mediaStream;
      video.width = 100;
      video.height = 100;
      video.autoplay = true;
      return video
      //this.add.existing(phaserVideo);
    } catch (e) {
      console.log("error", e.message, e.name);
    }
  }
}