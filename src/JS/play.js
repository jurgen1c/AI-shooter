import Player from './entities/player';
import Enemy from './entities/enemy';
import Chaser from './entities/chaser';
import ScrollingBackground from './entities/scrolling';
import ml5 from 'ml5';
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

async function getMedia(scene){
  try{
    const constraints = {
      video: {width: 80, height: 50},
      audio: false,
    };
    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    let video = document.createElement("video");
    video.playsinline = true;
    video.srcObject = mediaStream;
    video.width = 80;
    video.height = 50;
    video.autoplay = true;
    await video.play();
    const poseNet = await ml5.poseNet(video, ()=> {
      console.log('model ready :)');
    });
    poseNet.on('pose', result=>{
      scene.gotPoses(result, scene)
    });
    scene.video = video;
    scene.poseMl5 = poseNet;
    return scene;
  }catch(e){
    throw new Error(`Could not get media${e}`);
  }
}

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

  create(data = {}){
    let scoreCont = document.getElementById('score');
    scoreCont.style.display = 'none';
    this.playerName = data.name;
    console.log(this.playerName);
    this.livesText = this.add.text(16, 16, 'Lives: 5', { fontSize: '32px', fill: '#FFF' });
    this.scoreText = this.add.text(306, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });

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

    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enemies = this.add.group();
    this.enemyLasers = this.add.group();
    this.playerLasers = this.add.group();

    this.time.addEvent({
      delay: 3000,
      callback: function() {
        let enemy = null;

        if (Phaser.Math.Between(0, 10) >= 3) {
          enemy = new Enemy(
            this,
            Phaser.Math.Between(0, this.game.config.width),
            0
          );
        }
        else if (Phaser.Math.Between(0, 10) >= 5) {
          if (this.getEnemiesByType("ChaserShip").length < 5) {

            enemy = new Chaser(
              this,
              Phaser.Math.Between(0, this.game.config.width),
              0
            );
          }
        }

        if (enemy !== null) {
          enemy.setScale(Phaser.Math.Between(10, 20) * 0.1);
          this.enemies.add(enemy);
        }
      },
      callbackScope: this,
      loop: true
    });
    this.input.on('pointerdown', ()=> {
      if(this.pause){
        this.resume
      }else{
        this.pause
      }
    })
    getMedia(this).then(result=>{
      result.player = new Player(
        this,
        this.game.config.width * 0.5,
        this.game.config.height * 0.9,
        "Player",
        result.video
      );
      result.physics.add.collider(result.playerLasers, result.enemies, (playerLaser, enemy) => {
        if (enemy) {
          if (enemy.onDestroy !== undefined) {
            if(enemy.type == 'GunShip'){
  
              enemy.onDestroy();
              result.player.score += 100
            }else{
              console.log(enemy.type);
              enemy.onDestroy();
              result.player.score += 200
            }
          }
        
          enemy.explode(true);
          playerLaser.destroy();
        }
      });
      result.physics.add.overlap(result.player, result.enemies, (player, enemy) => {
        if (!player.getData("isDead") &&
            !enemy.getData("isDead")) {
          if(player.lives === 0){
            player.explode(false);
            player.onDestroy();
          }else{
            result.livesText.setText('Lives: ' + result.player.lives);
            player.lives -= 1;
          }
          enemy.explode(true);
        }
      });
      result.physics.add.overlap(result.player, result.enemyLasers, (player, laser) => {
        if (!player.getData("isDead") &&
            !laser.getData("isDead")) {
          if(player.lives === 0){
            player.explode(false);
            player.onDestroy();
          }else{
            result.livesText.setText('Lives: ' + result.player.lives);
            player.lives -= 1;
          }
          //player.onDestroy();
          laser.destroy();
        }
      });
    })
  }

  update(){
    if(this.player){
      if (!this.player.getData("isDead")) {
        this.player.update();
        if (this.keyW.isDown) {
          this.player.moveUp(200);
        }
        else if (this.keyS.isDown) {
          this.player.moveDown(200);
        }
        if (this.keyA.isDown) {
          this.player.moveLeft(200);
        }
        else if (this.keyD.isDown) {
          this.player.moveRight(200);
        }
      
        if (this.keySpace.isDown ) {
          this.player.setData("isShooting", true);
        }else {
          this.player.setData("timerShootTick", this.player.getData("timerShootDelay") - 1);
          this.player.setData("isShooting", false);
        }
      }
      this.scoreText.setText('Score: ' + this.player.score);
    }
    
    for (let i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update();
    }
    

    for (let i = 0; i < this.enemies.getChildren().length; i++) {
      let enemy = this.enemies.getChildren()[i];
      enemy.update();
      
      if (enemy.x < -enemy.displayWidth ||
        enemy.x > this.game.config.width + enemy.displayWidth ||
        enemy.y < -enemy.displayHeight * 4 ||
        enemy.y > this.game.config.height + enemy.displayHeight) {
    
          if (enemy) {
            if (enemy.onDestroy !== undefined) {
              enemy.onDestroy();
            }
      
            enemy.destroy();
            if(this.player.lives === 0){
              this.player.explode();
              this.player.onDestroy();
            }else{
              this.player.lives -= 1;
              this.livesText.setText('Lives: ' + this.player.lives);
            }
          }
      
      }
    }
    for (let i = 0; i < this.enemyLasers.getChildren().length; i++) {
      let laser = this.enemyLasers.getChildren()[i];
      laser.update();

      if (laser.x < -laser.displayWidth ||
        laser.x > this.game.config.width + laser.displayWidth ||
        laser.y < -laser.displayHeight * 4 ||
        laser.y > this.game.config.height + laser.displayHeight) {
        if (laser) {
          laser.destroy();
        }
      }
    }

    for (let i = 0; i < this.playerLasers.getChildren().length; i++) {
      let laser = this.playerLasers.getChildren()[i];
      laser.update();

      if (laser.x < -laser.displayWidth ||
        laser.x > this.game.config.width + laser.displayWidth ||
        laser.y < -laser.displayHeight * 4 ||
        laser.y > this.game.config.height + laser.displayHeight) {
        if (laser) {
          laser.destroy();
        }
      }
    }
  }

  getEnemiesByType(type) {
    let arr = [];
    for (let i = 0; i < this.enemies.getChildren().length; i++) {
      let enemy = this.enemies.getChildren()[i];
      if (enemy.getData("type") == type) {
        arr.push(enemy);
      }
    }
    return arr;
  }
  gotPoses(poses, scene){
    if(poses.length > 0){
      scene.pose = poses[0].pose;
      if(scene.player){
        if(scene.pose.nose.y > (scene.video.videoHeight / 4) * 3){
          scene.player.moveDown(300);
        }else if(scene.pose.nose.y < scene.video.videoHeight / 2) {
          scene.player.moveUp(300);
        }
        if(scene.pose.rightEye.x > (scene.video.videoWidth / 3) * 1.5){
          scene.player.moveLeft(400);
        }else if(scene.pose.leftEye.x < scene.video.videoWidth / 3){
          scene.player.moveRight(400);
        }
      }
    }
  }
}