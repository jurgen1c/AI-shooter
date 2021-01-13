import '../Assets/SCSS/main.scss';
import Phaser from 'phaser';
import SceneWelcome from './welcome';
import ScenePlay from './play';
import SceneGameOver from './finish';

const config = {
  type: Phaser.WEBGL,
  parent: 'game',
  dom: {
    createContainer: true,
    behindCanvas: false,
  },
  width: window.innerWidth * 0.6,
  height: window.innerHeight,
  backgroundColor: 'black',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },
  scene: [
    SceneWelcome,
    ScenePlay,
    SceneGameOver,
  ],
  pixelArt: true,
  roundPixels: true,
};

const game = new Phaser.Game(config);
