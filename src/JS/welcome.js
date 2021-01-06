export default class SceneWelcome extends Phaser.Scene {
  constructor(){
    super({ key: "SceneWelcome" });
  }
  preload(){

  }

  create(){
    this.scene.start("ScenePlay");
  }

  update(){

  }
}