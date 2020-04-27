const Router = require('koa-router');
const cheerio = require('cheerio');
const vm = require('vm');
const path = require('path');
const fs = require('fs');
const render = require('../utils/render');
const getData = require('../utils/getData');
const { URL } = require('../config');

const router = new Router();

const parseHtml = async (scripts) => {
  let global = {
    window: {}
  };
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i] && scripts[i].children.length > 0) {
      let scriptContent = scripts[i].firstChild.data;

      // http://nodejs.cn/api/vm.html
      vm.createContext(global);
      vm.runInContext(scriptContent, global);
    }
  }

  return global.window;
}

const readJSON = ({ path, key }) => {
  return new Promise((resolve, reject) => {
    try {
      // 'r' - 打开文件用于读取。如果文件不存在，则出现异常
      fs.open(path, 'r', (err, fd) => {
        if (err) {
          reject(err.message);
          return;
        }
        if (fd) {
          fs.readFile(fd, 'utf8', (err, data) => {
            if (err) reject(err.message);
            let obj = JSON.parse(data)
            resolve(obj[key]);
          });
        } else {
          reject(new Error('error'));
        }
      })

    } catch (error) {
      reject(error.message)
    }
  })
}

const handleRefresh = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const html = await getData(URL);
      // https://github.com/cheeriojs/cheerio
      const $ = cheerio.load(html);
      const scripts = $('body > script');
      const data = await parseHtml(scripts);

      const dataStr = JSON.stringify(data); // object转为string
      const buffer = Buffer.from(dataStr, 'utf8'); // 创建一个包含string的新Buffer
      const file = path.resolve(__dirname, '../assets/data.json');

      // 'w' - 打开文件用于写入。如果文件不存在则创建文件，如果文件已存在则截断文件
      fs.open(file, 'w', (err, fd) => {
        if (err) {
          console.log("====>err")
          throw err;
        };

        // NodeJs以流的形式写入文件 https://blog.csdn.net/weixin_34072458/article/details/92261921
        const writeStream = fs.createWriteStream(file); // 创建写入流

        writeStream.write(buffer, 'utf8');
        writeStream.end();
        writeStream.on('finish', () => {
          console.log("数据源写入成功!!!")
          resolve();
        });
        writeStream.on('error', (err) => reject(err.message));
      });

    } catch (error) {
      console.log(error);
      reject(error.message);
    }
  })
}

/**
 * data/getTimelineService 按时间线获取事件
  data/getStatisticsService 获取整体统计信息
  data/getAreaStat/:provice 获取指定省份信息，例如：/data/getAreaStat/山东
  data/getNewest/:lastid 获取最新事件
  data/getIndexRumorList 最新辟谣
  data/getIndexRecommendList 最新防护知识
  data/getWikiList 最新知识百科
  data/getEntries 诊疗信息
  data/getListByCountryTypeService1 全国省份级患者分布数据
  data/getListByCountryTypeService2true 全球海外其他地区患者分布数据
  data/getStatisticsService 获取整体统计信息
 */

async function handleGetData({ ctx, path, key }) {
  const [err, result] = await readJSON({
    path,
    key
  })
    .then(data => [null, data])
    .catch(err => [err, null]);

  if (err) { // 文件不存在，刷新数据源
    const [inerr, data] = await handleRefresh()
      .then(data => [null, data])
      .catch(err => [err, null]);

    if (inerr) { // 数据刷新失败
      ctx.response.body = {
        code: 201,
        msg: '数据获取异常'
      }
      return;
    }

    await handleGetData({ ctx, path, key });
    return;
  }

  ctx.response.body = result;
}

router.get('/', async (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = await render(path.resolve(__dirname, '../assets/index.html'));
  await next();
})

// 更新数据源数据
router.get('/refresh', async (ctx, next) => {
  const [err, data] = await handleRefresh().then(data => [null, data]).catch(err => [err, null]);

  if (err) {
    ctx.response.body = {
      code: 500,
      msg: err || '数据更新失败'
    }
  } else {
    console.log("数据源更新成功!!!")
    ctx.response.body = {
      code: 200,
      msg: '数据更新成功'
    }
  };

  await next();
})

router.get('/api/getAreaStat', async (ctx, next) => {
  await handleGetData({
    ctx,
    next,
    key: 'getAreaStat',
    path: path.resolve(__dirname, '../assets/data.json')
  });

  await next();
})

router.get('/api/getListByCountryTypeService2true', async (ctx, next) => {
  await handleGetData({
    ctx,
    next,
    key: 'getListByCountryTypeService2true',
    path: path.resolve(__dirname, '../assets/data.json')
  });

  await next();
})

module.exports = router;
