
import ScrollingBackground from './entities/scrolling';
import sprBg0 from '../Assets/images/sprBg0.png';
import sprBg1 from '../Assets/images/sprBg1.png';
import scoreManager from './score';

export default class SceneGameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneGameOver' });
  }

  preload() {
    this.load.image('sprBg0', sprBg0);
    this.load.image('sprBg1', sprBg1);
  }

  create(data) {
    this.playerScore = data.score;
    const scoreCont = document.getElementById('score');
    scoreManager.getScore().then(result => {
      scoreCont.style.display = 'block';
      scoreCont.innerHTML = '';
      for (let i = 0; i < 5; i += 1) {
        const div = document.createElement('div');
        div.className = 'p-score';
        div.textContent = `Player: ${result.result[i].user} Score: ${result.result[i].score}`;
        scoreCont.appendChild(div);
      }
    });
    this.sfx = {
      btnOver: this.sound.add('sndBtnOver'),
      btnDown: this.sound.add('sndBtnDown'),
    };

    this.btnRestart = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.7,
      'sprBtnRestart',
    );

    this.btnRestart.setInteractive();

    this.btnRestart.on('pointerover', () => {
      this.btnRestart.setTexture('sprBtnRestartHover'); // set the button texture to sprBtnPlayHover
      this.sfx.btnOver.play(); // play the button over sound
    }, this);

    this.btnRestart.on('pointerout', () => {
      this.btnRestart.setTexture('sprBtnRestart');
    });

    this.btnRestart.on('pointerdown', () => {
      this.btnRestart.setTexture('sprBtnRestartDown');
      this.sfx.btnDown.play();
    }, this);

    this.btnRestart.on('pointerup', () => {
      this.btnRestart.setTexture('sprBtnRestart');
      this.scene.start('SceneWelcome');
    }, this);

    this.backgrounds = [];
    for (let i = 0; i < 5; i += 1) {
      const keys = ['sprBg0', 'sprBg1'];
      const key = keys[Phaser.Math.Between(0, keys.length - 1)];
      const bg = new ScrollingBackground(this, key, i * 10);
      this.backgrounds.push(bg);
    }

    this.title = this.add.text(this.game.config.width * 0.5, 128, 'GAME OVER', {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
    });
    this.title.setOrigin(0.5);
    this.subtitle = this.add.text(this.game.config.width * 0.5, this.game.config.height * 0.85, 'Created by JCG', {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
    });
    this.subtitle.setOrigin(0.5);
    this.scoreText = this.add.text(this.game.config.width * 0.5, 328, `Score: ${this.playerScore}`, {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
    });
    this.scoreText.setOrigin(0.5);
  }

  update() {
    for (let i = 0; i < this.backgrounds.length; i += 1) {
      this.backgrounds[i].update();
    }
  }
}