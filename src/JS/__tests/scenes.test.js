import Phaser from 'phaser';
import Welcome from '../welcome';
import Finish from '../finish';
import 'jest-expect-subclass';

test('WelcomeScene should be a subclass of Phaser.Scene', () => {
  expect(Welcome).toBeSubclassOf(Phaser.Scene);
});

test('GameOverScene should be a subclass of Phaser.Scene', () => {
  expect(Finish).toBeSubclassOf(Phaser.Scene);
});