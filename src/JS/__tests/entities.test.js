import Phaser from 'phaser';
import Player from '../entities/player';
import Enemy from '../entities/enemy';
import Chaser from '../entities/chaser';
import 'jest-expect-subclass';

test('Plaer should be a subclass of Phaser.GameObjects', () => {
  expect(Player).toBeSubclassOf(Phaser.GameObjects.Video);
});

test('Enemy should be a subclass of Phaser.GameObjects', () => {
  expect(Enemy).toBeSubclassOf(Phaser.GameObjects.Sprite);
});

test('Chaser should be a subclass of Phaser.GameObjects', () => {
  expect(Chaser).toBeSubclassOf(Phaser.GameObjects.Sprite);
});