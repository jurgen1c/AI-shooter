import Phaser from 'phaser';
import Welcome from './welcome';
import Controls from './controls';
import Play from './play';
import GameOver from './finish';

let config = {
  type: Phaser.WEBGL,
  width: 480,
  height: 520,
  backgroundColor: "black",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 }
    }
  },
  scene: [
    Welcome,
    Controls,
    Play,
    GameOver
  ],
  pixelArt: true,
  roundPixels: true
}

const game = new Phaser.Game(config);