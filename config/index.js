const URL = 'https://ncov.dxy.cn/ncovh5/view/pneumonia';

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
  transporterConf,
  mailOptions
}
