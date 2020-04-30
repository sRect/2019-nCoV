const URL = 'https://ncov.dxy.cn/ncovh5/view/pneumonia';

const DB_COllECTION_NAME = {
  timelineService1: 'timelineService1',
  areaStat: 'areaStat',
  listByCountryTypeService2true: 'listByCountryTypeService2true'
}

const AreaConf = {
  All: '全部',
  Asia: '亚洲',
  Europe: '欧洲',
  Africa: '非洲',
  SouthAmerica: '南美洲',
  NorthAmerica: '北美洲',
  Oceania: '大洋洲'
}

// https://nodemailer.com/about/
// https://www.jianshu.com/p/f2e75080a5e2
const transporterConf = {
  host: "smtp.qq.email", // 邮箱服务商主机
  port: 465, // 邮箱服务商端接口
  secure: false, // true for 465, false for other ports // 开启安全连接
  auth: {
    user: "xxxxx@qq.com", // generated ethereal user
    // Q邮箱的配置，登录QQ邮箱 -> 设置 -> 账户 -> IMAP/SMTP 服务 -> 开启
    pass: "xxxxxx" // generated ethereal password 邮箱的授权码
  }
}

const mailOptions = {
  from: "xxxxx@qq.com", // sender address
  to: "xxxxx@qq.com", // list of receivers
  subject: "2019-nCov", // Subject line
  text: `Hello world? date: ${new Date().getTime()}`, // plain text body
  html: "<b>Hello world?</b>" // html body
}

module.exports = {
  URL,
  DB_COllECTION_NAME,
  transporterConf,
  mailOptions,
  AreaConf
}
