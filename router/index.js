const Router = require('koa-router');
const cheerio = require('cheerio');
const vm = require('vm');
const { resolve } = require('path');
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


const readJSON = ({path, key}) => {
  return new Promise((resolve, reject) => {
    try {
      // 检查当前目录中是否存在该文件。
      fs.access(path, fs.constants.F_OK, (err) => {
        if (err) reject(err);
        fs.readFile(path, 'utf8', (err, data) => {
          if (err) reject(err);
          let obj = JSON.parse(data)
          resolve(obj[key]);
        });
      });
      
    } catch (error) {
      console.log(error)
      reject(error)
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

router.get('/', async (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = await render(resolve(__dirname, '../assets/index.html'));
  await next();
})

// 更新数据源数据
router.get('/refresh', async (ctx, next) => {
  const html = await getData(URL);
  // https://github.com/cheeriojs/cheerio
  const $ = cheerio.load(html);
  let scripts = $('body > script');

  let data = await parseHtml(scripts);
  await fs.writeFile(resolve(__dirname, '../assets/data.json'), JSON.stringify(data), 'utf8', err => {
    if (err) {
      console.log("data 保存失败");
      ctx.response.body = {
        code: 500,
        msg: '数据更新失败'
      };
      throw err;
    };
    console.log("data 保存成功")
  })

  ctx.response.body = {
    code: 200,
    msg: '数据更新成功'
  };

  await next();
})

router.get('/api/getAreaStat', async (ctx, next) => {
  let aAreaStat = await readJSON({
    path: resolve(__dirname, '../assets/data.json'),
    key: 'getAreaStat'
  });

  ctx.response.body = aAreaStat;
  await next();
})

module.exports = router;
