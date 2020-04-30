// https://github.com/programmerauthor/info-sender/blob/master/store/db-store.js
// https://juejin.im/post/5e5b344651882549112b4085
const Datastore = require('nedb');
const path = require('path');
const { DB_COllECTION_NAME } = require('../config');

const db = {};

// 初始化timelineService1和areaStat两个集合
db[DB_COllECTION_NAME.timelineService1] = new Datastore({
  filename: path.resolve(__dirname, `./${DB_COllECTION_NAME.timelineService1}.db`), // 指定数据存储的文件位置
  autoload: true // 自动加载数据库
});

db[DB_COllECTION_NAME.areaStat] = new Datastore({
  filename: path.resolve(__dirname, `./${DB_COllECTION_NAME.areaStat}.db`),
  autoload: true
});

db[DB_COllECTION_NAME.listByCountryTypeService2true] = new Datastore({
  filename: path.resolve(__dirname, `./${DB_COllECTION_NAME.listByCountryTypeService2true}.db`),
  autoload: true
})

// 插入数据
const insert = ({ collection, data }) => {
  return new Promise((resolve, reject) => {
    db[collection].insert(data, (err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  })
}

/**
 * 分页查询
 * @param {Object} query     查询条件
 * @param {Object} sortQuery 排序条件
 * @param {Number} pageNum   当前页
 * @param {Number} pageSize  页大小
 */
const find = ({ collection, query = {}, sortQuery = {}, pageNum = 0, pageSize = 10 }) => {
  return new Promise((resolve, reject) => {
    db[collection].find({ ...query })
      .limit(pageSize)
      .skip(pageNum * pageSize)
      .sort({ ...sortQuery })
      .exec((err, data) => {
        if (err) reject(err);
        resolve(data);
      })
  })
}

// update
const update = ({ collection, query, update, options }) => {
  return new Promise((resolve, reject) => {
    db[collection].update({ ...query }, { ...update }, { ...options }, (err, numReplaced) => {
      if (err) reject(err);
      resolve(numReplaced);
    })
  })
}

// remove
const remove = ({ collection, query, options }) => {
  return new Promise((resolve, reject) => {
    db[collection].remove({ ...query }, { ...options }, (err, numRemoved) => {
      if (err) reject(err);
      resolve(numRemoved);
    })
  })
}

module.exports = {
  insert,
  find,
  update,
  remove
}
