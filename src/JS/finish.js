
import ScrollingBackground from './entities/scrolling';
import sprBg0 from '../Assets/images/sprBg0.png';
import sprBg1 from '../Assets/images/sprBg1.png';
import scoreManager from './score';

export default class SceneGameOver extends Phaser.Scene {
  constructor(){
    super({ key: "SceneGameOver" });
  }
  preload(){
    this.load.image("sprBg0", sprBg0);
    this.load.image("sprBg1", sprBg1);
  }
  create(){
    let scoreCont = document.getElementById('score');
    scoreManager.getScore().then(result => {
      scoreCont.style.display = 'block';
      scoreCont.innerHTML = '';
      for (let i = 0; i < 5; i++){
        let div = document.createElement('div');
        div.className = 'p-score';
        div.textContent = `Player: ${result.result[i].user} Score: ${result.result[i].score}`;
        scoreCont.appendChild(div)
      }
    });
    this.sfx = {
      btnOver: this.sound.add("sndBtnOver"),
      btnDown: this.sound.add("sndBtnDown")
    };

    this.btnRestart = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.7,
      "sprBtnRestart"
    );

    this.btnRestart.setInteractive();

    this.btnRestart.on("pointerover", function() {
      this.btnRestart.setTexture("sprBtnRestartHover"); // set the button texture to sprBtnPlayHover
      this.sfx.btnOver.play(); // play the button over sound
    }, this);

    this.btnRestart.on("pointerout", function() {
      this.setTexture("sprBtnRestart");
    });

    this.btnRestart.on("pointerdown", function() {
      this.btnRestart.setTexture("sprBtnRestartDown");
      this.sfx.btnDown.play();
    }, this);

    this.btnRestart.on("pointerup", function() {
      this.btnRestart.setTexture("sprBtnRestart");
      this.scene.start("SceneWelcome");
    }, this);

    this.backgrounds = [];
    for (var i = 0; i < 5; i++) {
      var keys = ["sprBg0", "sprBg1"];
      var key = keys[Phaser.Math.Between(0, keys.length - 1)];
      var bg = new ScrollingBackground(this, key, i * 10);
      this.backgrounds.push(bg);
    }

    this.title = this.add.text(this.game.config.width * 0.5, 128, "GAME OVER", {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    });
    this.title.setOrigin(0.5);
    this.subtitle = this.add.text(this.game.config.width * 0.5, 228, "Created by JCG", {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    });
    this.subtitle.setOrigin(0.5);
    this.scoreText = this.add.text(this.game.config.width * 0.5, 328, `Score: ${this.playerScore}`)
  }
  update()
  {
    for (var i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update();
    }
  }
}