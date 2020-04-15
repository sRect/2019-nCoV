const handleDate = timestamp => {
  let oDate = new Date(timestamp);
  return oDate.getFullYear() + "-" + (oDate.getMonth() + 1) + "-" + oDate.getDate() + " " + oDate.getHours() + ":" + oDate.getMinutes() + ":" + oDate.getSeconds();
}

module.exports = handleDate;
