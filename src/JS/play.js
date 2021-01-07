import Player from './entities/player';
import ml5 from 'ml5/dist/ml5';
import ScrollingBackground from './entities/scrolling';
import sprBg0 from '../Assets/images/sprBg0.png';
import sprBg1 from '../Assets/images/sprBg1.png';
import sprExplosion from '../Assets/images/sprExplosion.png';
import sprEnemy0 from '../Assets/images/sprEnemy0.png';
import sprEnemy1 from '../Assets/images/sprEnemy1.png';
import sprEnemy2 from '../Assets/images/sprEnemy2.png';
import sprLaserEnemy0 from '../Assets/images/sprLaserEnemy0.png';
import sprLaserPlayer from '../Assets/images/sprLaserPlayer.png';
import sndExplode0 from '../Assets/images/sndExplode0.wav';
import sndExplode1 from '../Assets/images/sndExplode1.wav';
import sndLaser from '../Assets/images/sndLaser.wav';
import mask from '../Assets/images/mask.png';
export default class ScenePlay extends Phaser.Scene {
  constructor(){
    super({ key: "ScenePlay" });
  }
  preload(){
    this.load.image("sprBg0", sprBg0, {
      width: this.game.config.width,
      height: this.game.config.height,
    });
    this.load.image("sprBg1", sprBg1);
    this.load.image("mask", mask);
    this.load.spritesheet("sprExplosion", sprExplosion, {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("sprEnemy0", sprEnemy0, {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image("sprEnemy1", sprEnemy1);
    this.load.spritesheet("sprEnemy2", sprEnemy2, {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image("sprLaserEnemy0", sprLaserEnemy0);
    this.load.image("sprLaserPlayer", sprLaserPlayer);
    this.load.audio("sndExplode0", sndExplode0);
    this.load.audio("sndExplode1", sndExplode1);
    this.load.audio("sndLaser", sndLaser);
  }

  create(){
    this.pose = null;
    this.skeleton = null;
    this.poseLabel = null;
    this.anims.create({
      key: "sprEnemy0",
      frames: this.anims.generateFrameNumbers("sprEnemy0"),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "sprEnemy2",
      frames: this.anims.generateFrameNumbers("sprEnemy2"),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "sprExplosion",
      frames: this.anims.generateFrameNumbers("sprExplosion"),
      frameRate: 20,
      repeat: 0
    });

    this.anims.create({
      key: "sprPlayer",
      frames: this.anims.generateFrameNumbers("sprPlayer"),
      frameRate: 20,
      repeat: -1
    });
    this.sfx = {
      explosions: [
        this.sound.add("sndExplode0"),
        this.sound.add("sndExplode1")
      ],
      laser: this.sound.add("sndLaser")
    };
    this.backgrounds = [];
    for (let i = 0; i < 5; i++) { // create five scrolling backgrounds
      let bg = new ScrollingBackground(this, "sprBg0", i * 10);
      this.backgrounds.push(bg);
    }
    this.player = new Player(
      this,
      200,
      400,
      "Player",
    );
    this.poseNet = ml5.poseNet(this.player.video, ()=>{console.log('model ready:)')});
    this.poseNet.on('pose', this.gotPoses);

    let options = {
      input: 34,
      output: 6,
      task: 'classification',
      debug: true
    }
    this.brain = ml5.neuralNetwork(options);
    const modelInfo = {
      model: 'model/model.json',
      metadata: 'model/model_meta.json',
      weights: 'model/model.weights.bin',
    }
    this.brain.load(modelInfo, this.brainLoaded);

    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enemies = this.add.group();
    this.enemyLasers = this.add.group();
    this.playerLasers = this.add.group();

    this.physics.add.collider(this.playerLasers, this.enemies, (playerLaser, enemy) => {
      if (enemy) {
        if (enemy.onDestroy !== undefined) {
          enemy.onDestroy();
        }
      
        enemy.explode(true);
        playerLaser.destroy();
      }
    });
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      if (!player.getData("isDead") &&
          !enemy.getData("isDead")) {
        player.explode(false);
        player.onDestroy();
        enemy.explode(true);
      }
    });
    this.physics.add.overlap(this.player, this.enemyLasers, (player, laser) => {
      if (!player.getData("isDead") &&
          !laser.getData("isDead")) {
        player.explode(false);
        player.onDestroy();
        laser.destroy();
      }
    });

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
      if (this.keyA.isDown || this.poseLabel === 'left') {
        this.player.moveLeft();
      }
      else if (this.keyD.isDown || this.poseLabel === 'right') {
        this.player.moveRight();
      }
    
      if (this.keySpace.isDown || this.poseLabel === 'fire') {
        this.player.setData("isShooting", true);
      }
      else {
        this.player.setData("timerShootTick", this.player.getData("timerShootDelay") - 1);
        this.player.setData("isShooting", false);
      }
    }
  }
  brainLoaded(){
    this.classifyPose();
  }
  gotPoses(poses){
    if(poses.length > 0){
      this.pose = poses[0].pose;
      this.skeleton = poses[0].skeleton;
    }
  }
  classifyPose(){
    if(this.pose){
      let inputs = [];
  
      for(let i = 0; i < pose.keypoints.length; i++){
        let x = this.pose.keypoints[i].position.x;
        let y = this.pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
      }
      this.brain.classify(inputs, this.gotResult);
    }else {
      setTimeout(classifyPose, 100);
    }
  }
  gotResult(){
    if(results[0].confidence > 0.75){
      this.poseLabel = results[0].label;
    }
    console.log(results[0].confidence);
    this.classifyPose();
  }
}