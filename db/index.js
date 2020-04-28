// https://github.com/programmerauthor/info-sender/blob/master/store/db-store.js
// https://juejin.im/post/5e5b344651882549112b4085
const NeDB = require('nedb');

const db = new NeDB({
  filename: './info.db', // 指定数据存储的文件位置
  autoload: true // 自动加载数据库
})

// 插入数据
const insert = (data) => {
  return new Promise((resolve, reject) => {
    db.insert(data, (err, data) => {
      if(err) reject(err);
      resolve(data);
    })
  })
}

// 分页查询
const find = ({ query, sortQuery, pageNum, pageSize}) => {
  return new Promise((resolve, reject) => {
    db.find({...query})
      .limit(pageSize)
      .skip(pageNum * pageSize)
      .sort({ ...sortQuery})
  })
}