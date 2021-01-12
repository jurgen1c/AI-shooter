import Entity from './entity';
import ml5 from 'ml5';
import modelJson from '../../Assets/Model/model_controls.json';
import modelMeta from '../../Assets/Model/model_meta_controls.json';
import modelWeights from '../../Assets/Model/model.weights.bin';
export default class Player extends Phaser.GameObjects.Video {
  constructor(scene, x, y, key){
    super(scene, x, y, key);
    this.scene = scene;
    this.width = 50;
    this.height = 50;
    this.lives = 5;
    this.score = 0;
    this.bodyPix = null;
    this.flipX = true;
    this.removeVideoElementOnDestroy = true;
    this.setData("type", 'Player');
    this.setData("isDead", false);
    this.setData("speed", 200);
    //this.play("sprPlayer");
    this.setData("isShooting", false);
    this.setData("timerShootDelay", 10);
    this.setData("timerShootTick", this.getData("timerShootDelay") - 1);
    this.getMedia().then( result => {
      result.scene.add.existing(this);
      result.scene.physics.add.existing(this);
      result.scene.poseNet.on('pose', result.gotPoses);
      /* result.getBrain().then( ()=> {
        const modelInfo = {
          model: modelJson,
          metadata: modelMeta,
          weights: modelWeights,
        }
        this.scene.brain.load(modelInfo, this.scene.brainLoaded());
      }) */
    })
  }

  explode(canDestroy){
    if (this.lives <= 0) {
      // Set the texture to the explosion image, then play the animation
      this.setTexture("sprExplosion");  // this refers to the same animation key we used when we added this.anims.create previously
      this.play("sprExplosion"); // play the animation

      // pick a random explosion sound within the array we defined in this.sfx in SceneMain
      this.scene.sfx.explosions[Phaser.Math.Between(0, this.scene.sfx.explosions.length - 1)].play();

      if (this.shootTimer !== undefined) {
        if (this.shootTimer) {
          this.shootTimer.remove(false);
        }
      }

      this.setAngle(0);
      this.body.setVelocity(0, 0);

      this.on('animationcomplete', function() {

        if (canDestroy) {
          this.destroy();
        }
        else {
          this.setVisible(false);
        }

      }, this);
      this.onDestroy();
      this.setData("isDead", true);
    }else{
      this.lives -= 1
    }
  }

  moveUp() {
    this.body.velocity.y = -this.getData("speed");
  }
  
  moveDown() {
    this.body.velocity.y = this.getData("speed");
  }
  
  moveLeft() {
    this.body.velocity.x = -this.getData("speed");
  }
  
  moveRight() {
    this.body.velocity.x = this.getData("speed");
  }

  update() {
    if(this.body){
      this.body.setVelocity(0, 0);
    }

    this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
    this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);
    if (this.getData("isShooting")) {
      if (this.getData("timerShootTick") < this.getData("timerShootDelay")) {
        this.setData("timerShootTick", this.getData("timerShootTick") + 1); // every game update, increase timerShootTick by one until we reach the value of timerShootDelay
      }
      else { // when the "manual timer" is triggered:
        var laser = new PlayerLaser(this.scene, this.x, this.y);
        this.scene.playerLasers.add(laser);
      
        this.scene.sfx.laser.play(); // play the laser sound effect
        this.setData("timerShootTick", 0);
      }
    }
  }

  onDestroy() {
    this.scene.time.addEvent({ // go to game over scene
      delay: 1000,
      callback: function() {
        this.scene.scene.start("SceneGameOver");
      },
      callbackScope: this,
      loop: false
    });
  }

  async getMedia(){
    try {
      const constraints = {
        video: {width: 200, height: 200},
        audio: false,
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      let video = document.createElement("video");
      video.playsinline = true;
      video.srcObject = mediaStream;
      video.width = constraints.width;
      video.height = constraints.height;
      video.autoplay = true;
      this.video = video;
      await this.video.play();
      this.scene.poseNet = await ml5.poseNet(this.video, ()=>{console.log('model ready:)')});
      if (this.videoTexture)
      {
        this.scene.sys.textures.remove(this._key);

        this.videoTexture = this.scene.sys.textures.create(this._key, this.video, this.video.videoWidth, this.video.videoHeight);
        this.videoTextureSource = this.videoTexture.source[0];
        this.videoTexture.add('__BASE', 0, 0, 0, this.video.videoWidth, this.video.videoHeight);

        this.setTexture(this.videoTexture);
        this.setSizeToFrame();
        this.updateDisplayOrigin();

        this.emit(Phaser.Events.VIDEO_CREATED, this, this.video.videoWidth, this.video.videoHeight);
      }
      else
      {
        this.updateTexture();
      }
      return this;

    } catch (e) {
      console.log("error", e.message, e.name);
    }
  }
  gotPoses(poses){
    if(poses.length > 0){
      this.pose = poses[0].pose;
      if(this.pose.rightEye.x > 200 / 3){
        this.moveLeft();
      }else if(this.pose.leftEye.x > (200 / 3) * 2){
        this.moveRight();
      }
      if(this.pose.rightWrist.y > 200 / 3 || this.pose.leftWrist.y > 200 /3){
        this.setData("isShooting", true);
      }else {
        this.setData("timerShootTick", this.getData("timerShootDelay") - 1);
        this.setData("isShooting", false);
      }   //console.log(this.pose)
      //this.skeleton = poses[0].skeleton;
    }
  }
  async getBrain(){
    try{
      
      let options = {
        input: 34,
        output: 4,
        task: 'classification',
        debug: true
      }
      this.scene.brain = await ml5.neuralNetwork(options);

    }catch (e){
      console.log(e);
    }
  }
}

class PlayerLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprLaserPlayer");
    this.body.velocity.y = -200;
  }
}