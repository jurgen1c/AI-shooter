import ScrollingBackground from './entities/scrolling';
import scoreManager from './score';
import sprBg0 from '../Assets/images/sprBg0.png';
import sprBg1 from '../Assets/images/sprBg1.png';
import sprBtnPlay from '../Assets/images/sprBtnPlay.png';
import sprBtnPlayHover from '../Assets/images/sprBtnPlayHover.png';
import sprBtnPlayDown from '../Assets/images/sprBtnPlayDown.png';
import sprBtnRestart from '../Assets/images/sprBtnRestart.png';
import sprBtnRestartHover from '../Assets/images/sprBtnRestartHover.png';
import sprBtnRestartDown from '../Assets/images/sprBtnRestartDown.png';
import sndBtnOver from '../Assets/images/sndBtnOver.wav';
import sndBtnDown from '../Assets/images/sndBtnDown.wav';

let inputText;
export default class SceneWelcome extends Phaser.Scene {
  constructor(){
    super({ key: "SceneWelcome" });
  }
  preload(){
    this.load.image("sprBg0", sprBg0);
    this.load.image("sprBg1", sprBg1);
    this.load.image("sprBtnPlay", sprBtnPlay);
    this.load.image("sprBtnPlayHover", sprBtnPlayHover);
    this.load.image("sprBtnPlayDown", sprBtnPlayDown);
    this.load.image("sprBtnRestart", sprBtnRestart);
    this.load.image("sprBtnRestartHover", sprBtnRestartHover);
    this.load.image("sprBtnRestartDown", sprBtnRestartDown);

    this.load.audio("sndBtnOver", sndBtnOver);
    this.load.audio("sndBtnDown", sndBtnDown);
  }

  create(){
    let scoreCont = document.getElementById('score');
    scoreManager.getScore().then(result => {
      scoreCont.innerHTML = '';
      for (let i = 0; i < 5; i++){
        let div = document.createElement('div');
        div.className = 'p-score';
        div.textContent = `Player: ${result.result[i].user} Score: ${result.result[i].score}`;
        scoreCont.appendChild(div)
      }
    });
    //this.scene.start("ScenePlay");
    this.sfx = {
      btnOver: this.sound.add("sndBtnOver"),
      btnDown: this.sound.add("sndBtnDown")
    };

    this.title = this.add.text(this.game.config.width * 0.5, 228, "HEALTHY SHOOTER", {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    });
    this.title.setOrigin(0.5);
    const text = this.add.text(this.game.config.width * 0.5, 40, 'Please enter your name', { color: 'white', fontSize: '42px '});
    text.setOrigin(0.5)
    let form = `
    <input type="text" name="nameField" placeholder="Enter your name" style="font-size: 32px">
    <input type="button" name="playButton" value="Add Name" style="font-size: 32px">
    `;

    const element = this.add.dom(this.game.config.width * 0.5, 0).createFromHTML(form);
    element.setOrigin(0.5);
    element.addListener('click');

    element.on('click', function (event) {

        if (event.target.name === 'playButton')
        {
            inputText = element.getChildByName('nameField');

            //  Have they entered anything?
            if (inputText.value !== '')
            {
                //  Turn off the click events
                element.removeListener('click');

                //  Hide the login element
                element.setVisible(false);

                //  Populate the text with whatever they typed in
                text.setText('Welcome ' + inputText.value);
            }
            else
            {
                //  Flash the prompt
                this.scene.tweens.add({
                    targets: text,
                    alpha: 0.2,
                    duration: 250,
                    ease: 'Power3',
                    yoyo: true
                });
                        }
        }

    });
    this.tweens.add({
        targets: element,
        y: 150,
        duration: 2000,
        ease: 'Power3'
    });

    this.btnPlay = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "sprBtnPlay"
    );
    this.btnPlay.setInteractive();

    this.btnPlay.on("pointerover", function() {
      this.btnPlay.setTexture("sprBtnPlayHover"); // set the button texture to sprBtnPlayHover
      this.sfx.btnOver.play(); // play the button over sound
    }, this);

    this.btnPlay.on("pointerout", function() {
      this.setTexture("sprBtnPlay");
    });

    this.btnPlay.on("pointerdown", function() {
      this.btnPlay.setTexture("sprBtnPlayDown");
      this.sfx.btnDown.play();
    }, this);

    this.btnPlay.on("pointerup", function() {
      this.btnPlay.setTexture("sprBtnPlay");
      this.scene.start("ScenePlay", { name: inputText.value });
    }, this);

    

    this.backgrounds = [];
    for (var i = 0; i < 5; i++) {
      var keys = ["sprBg0", "sprBg1"];
      var key = keys[Phaser.Math.Between(0, keys.length - 1)];
      var bg = new ScrollingBackground(this, key, i * 10);
      this.backgrounds.push(bg);
    }
  }

  update(){
    for (var i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update();
    }
  }
}