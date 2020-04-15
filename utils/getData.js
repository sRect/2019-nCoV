const axios = require('axios');

const getData = async (url) => {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(res => resolve(res.data))
      .catch(err => reject(err))
  })
}

module.exports = getData;
