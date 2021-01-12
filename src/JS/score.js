class Manager {
  constructor(key, url){
    this.key = key;
    this.url = url;
    this.data = {
      name: 'somestring',
      score: 40,
    };
  }

  async postScore(data){
    const fullData = data;
  try {
    const response = await fetch(url, {
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

}

export default Manager;