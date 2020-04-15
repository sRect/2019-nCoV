const fs = require('fs');

const render = (filePath) => { // 读取首页
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports = render;
