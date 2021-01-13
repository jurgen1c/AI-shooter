class Manager {
  constructor() {
    // key: Za9DjzLaF8mX5266ZIyc
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
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      throw new Error(`Could not reach the API: ${error}`);
    }
  }

  async getScore() {
    try {
      const scoreData = await fetch(this.url);
      const responseScore = await scoreData.json();
      return responseScore;
    } catch (e) {
      throw new Error(`Could not complete request: ${e}`);
    }
  }
}

const scoreManager = new Manager();
export default scoreManager;