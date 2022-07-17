const jwt = require('jsonwebtoken');
const {
  PRIVATE_KEY
} = require('../app/config');

class AuthController{
  async login(ctx, next){
    const { id, name } = ctx.user;
    // 使用私钥进行加密
    const token = jwt.sign(ctx.user, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24, // 有效期 1 天
      algorithm: 'RS256' // 加密算法
    })
    ctx.body = {id, name, token}
  };
  async success(ctx, next){
    ctx.body = `验证授权成功~~`;
  }
}

module.exports = new AuthController();