import 'regenerator-runtime';

class Manager {
  constructor() {
    this.key = 'Za9DjzLaF8mX5266ZIyc';
    this.url = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${this.key}/scores/`;
  }


  async postScore(data = {}) {
    const fullData = data;
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(fullData),
      });
      return response.json();
    } catch (error) {
      throw new Error(`Could not reach the API: ${error}`);
    }
  }

  async getScore() {
    try {
      const scoreData = await fetch(this.url);
      return scoreData.json();
    } catch (e) {
      throw new Error(`Could not complete request: ${e}`);
    }
  }
}

const scoreManager = new Manager();
export default scoreManager;