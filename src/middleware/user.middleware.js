/**
 * user 额外处理的中间件
 * 路由中负责拦截判断处理的中间件（为最后一个中间件执行，做参数校验、组装数据等工作）
 */

const errorType = require('../constants/error-types');
const userSerive = require('../service/user.service');
const { md5password } = require('../utils/password-handle');

const verifyUser = async (ctx, next) =>{
  // 1.获取用户名和密码
  const {name, password} = ctx.request.body;

  // 2.判断用户名和密码不能为空
  if(!name || !password){
    const error = new Error(errorType.NAME_OR_PASSWORD_REQUIRE);
    // 触发错误事件
    return ctx.app.emit('error', error, ctx);
  }
  // 3.数据库表中是否存在此用户
  const res = await userSerive.getUserByName(name);
  if(res.length){
    // 存在结果，则触发错误事件
    const error = new Error(errorType.USER_ALREADY_EXISTS);
    return ctx.app.emit('error', error, ctx);
  }
  // 验证通过就调用 next，继续执行下一个匹配的中间件
  // 调用 next 需要 await，否则下一个中间件还没执行完就返回结果了 
  await next();
}

const handlePassword = async(ctx, next) =>{
  const { password } = ctx.request.body;
  ctx.request.body.password = md5password(password);

  await next();
}

module.exports = {
  verifyUser,
  handlePassword
}