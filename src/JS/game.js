import Phaser from 'phaser';
import SceneWelcome from './welcome';
import SceneControls from './controls';
import ScenePlay from './play';
import SceneGameOver from './finish';

let scaleRatio = window.devicePixelRatio / 3

let config = {
  type: Phaser.WEBGL,
  width: window.innerWidth / 1.1, 
  height: window.innerHeight / 1.1,
  backgroundColor: "black",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 }
    }
  },
  scene: [
    SceneWelcome,
    SceneControls,
    ScenePlay,
    SceneGameOver
  ],
  pixelArt: true,
  roundPixels: true
}

const game = new Phaser.Game(config);