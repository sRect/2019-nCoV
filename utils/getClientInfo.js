/**
 * @getClientIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
function getClientIP(req) {
  return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.connection && req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket && req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection && req.connection.socket && req.connection.socket.remoteAddress;
};

function getClientDevice(request) {
  let deviceAgent = request.headers && request.headers["user-agent"] && request.headers["user-agent"].toLowerCase();
  if (deviceAgent) {
    let agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);

    return agentID ? 'mobile' : 'PC';
  } else {
    return '未知设备';
  }

}

module.exports = {
  getClientIP,
  getClientDevice
};
