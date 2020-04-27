// https://juejin.im/post/5e2c6a6e51882526b757cf2e
// https://juejin.im/post/5e3285c8f265da3e097e9e7c
const Koa = require('koa');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const router = require('./router');
const handleError = require('./middleware/handleError');
const logClientInfo = require('./middleware/logClientInfo');
const sendMail = require('./utils/sendMail.js');
const app = new Koa();

app.use(bodyParser());
app.use(static(path.resolve(__dirname, './')));
app.use(handleError);
app.use(logClientInfo);

app
  .use(router.routes())
  .use(router.allowedMethods());


app.on('error', function (err) {
  console.log('logging error ', err.message);
  console.log(err);
});

sendMail().catch((error) => {
  console.log("err===>")
  console.error(error)
});

app.listen(4000, () => {
  console.log('====your app is running at port 4000=====')
});
