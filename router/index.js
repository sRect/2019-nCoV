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
      vm.createContext(global);
      vm.runInContext(scriptContent, global);
    }
  }

  return global.window;
}

router.get('/', async (ctx, next) => {
  const html = await getData(URL);
  const $ = cheerio.load(html);
  let scripts = $('body > script');
  let data = await parseHtml(scripts);
  await fs.writeFile(resolve(__dirname, '../assets/data.json'), JSON.stringify(data), 'utf8', err => {
    if (err) {
      console.log("data 保存失败")
      throw err;
    };
    console.log("data 保存成功")
  })

  ctx.response.type = 'html';
  // ctx.response.body = await render(resolve(__dirname, '../assets/index.html'));
  ctx.response.body = data;

  await next();
})

module.exports = router;
