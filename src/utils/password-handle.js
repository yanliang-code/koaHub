const crypto = require('crypto');

const md5password = (password) =>{
  const md5 = crypto.createHash('md5');
  // 默认是二进制的，转换为十六进制
  const res = md5.update(password).digest('hex');
  return res;
}

module.exports ={
  md5password
}