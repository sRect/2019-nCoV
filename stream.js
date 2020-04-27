// 使用流 拷贝文件例子
// https://mp.weixin.qq.com/s/TduO732TrflHdglnTv0jEg
const fs = require('fs');
const path = require('path');

const fileName1 = path.resolve(__dirname, './assets/data.json');
const fileName2 = path.resolve(__dirname, './assets/data_copy.json');

const readStream = fs.createReadStream(fileName1); // 读取文件流
const writeStream = fs.createWriteStream(fileName2); // 写入文件流

// readStream.pipe(writeStream);
fs.open(fileName2, 'w', (err) => {
  if(err) throw err;
  readStream.pipe(writeStream);
})

readStream.on('end', () => {
  console.log("copy end!!!")
})
