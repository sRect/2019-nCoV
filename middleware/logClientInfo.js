const { getClientIP, getClientDevice } = require('../utils/getClientInfo');
const handleDate = require('./handleDate');

const getClientInfo = async (ctx, next) => { // 全局处理错误
  try {
    try {
      let ip = getClientIP(ctx.request);
      let device = getClientDevice(ctx.request);
      let timestamp = new Date().getTime();
      let visitDate = handleDate(timestamp);
      console.log("来访日期：" + visitDate + ", 来访IP：" + ip + ", 访问设备：" + device);
    } catch (e) {
      console.log(e);
    }

    await next();
  } catch (err) {
    console.log(err)
  }
}

module.exports = getClientInfo;
