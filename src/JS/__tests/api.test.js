import api from '../score';

const axios = require('axios');

jest.mock('axios');

it('It should return the player name', () => {
  axios.get.mockResolvedValue({
    data: [
      {
        name: 'JCG',
        score: 420,
      },
    ],
  });
  api.postScore()
    .then((data) => {
      expect(data.name).toEqual('JCG');
    }).catch((error) => error);
});

it('It should return the player score', () => {
  axios.get.mockResolvedValue({
    data: [
      {
        name: 'JCG',
        score: 150,
      },
    ],
  });
  api.postScore()
    .then((data) => {
      expect(data.score).toEqual(150);
    }).catch((error) => error);
});

it('It should fail if player score is incorrect', () => {
  axios.get.mockResolvedValue({
    data: [
      {
        name: 'JCG',
        score: 150,
      },
    ],
  });
  api.postScore()
    .then((data) => {
      expect(data.score).not.toBe(210);
    }).catch((error) => error);
});