const jwt = require('jsonwebtoken');
const errorType = require('../constants/error-types');
const userSerive = require('../service/user.service');
const authSerive = require('../service/auth.service')
const {
  PUBLIC_KEY
} = require('../app/config');
const { 
  md5password
} = require('../utils/password-handle')

const verifyLogin = async (ctx, next) =>{
  // 1.获取用户名、密码
  const {name, password} = ctx.request.body;
  // 2.检测用户名、密码是否有效
  if(!name || !password){
    const error = new Error(errorType.NAME_OR_PASSWORD_REQUIRE);
    // 触发错误事件
    return ctx.app.emit('error', error, ctx);
  }
  // 3.检测用户名是否已注册
  const res = await userSerive.getUserByName(name);
  if(!res.length){
    // 用户名未注册
    const error = new Error(errorType.USER_NO_EXISTS);
    return ctx.app.emit('error', error, ctx);
  }
  // 4.检测已注册得用户名对应的密钥是否正确
  if(md5password(password) !== res[0].password){
    // 密码不正确
    const error = new Error(errorType.PASSWORD_IS_INCORRENT);
    return ctx.app.emit('error', error, ctx);
  }

  // 如果验证成功，将当前用户信息放到 ctx 上下文中
  ctx.user = res[0];
  await next();
}

const verifyAuth = async (ctx, next) =>{
  console.log('开始验证是否登陆');
  // 1.获取请求参数 token
  const {authorization} = ctx.request.headers;
  if(!authorization){
    // 请求未携带 token
    const error = new Error(errorType.UNAUTHORIZATION);
    return ctx.app.emit('error', error, ctx);
  }
  const token = authorization.replace('Bearer ', '');
  // 2.jwt 解析，存在成功，异常触发失败事件
  try {
    const res = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
    })
    ctx.user = res;
    await next();
  } catch (err) {
    const error = new Error(errorType.UNAUTHORIZATION);
    return ctx.app.emit('error', error, ctx);
  }
}
/**
 * 1.很多内容需要验证权限：修改/删除动态、修改/删除评论
 * 2.接口：业务接口系统/后端管理系统（两个系统都需要此类型的接口）
 *    一对一：user --- role
 *    多对多：role --- menu
 * 
 * 需要扩展一下，达到通用的权限校验
 * 动态的就是表名以及请求接口的入参 key
 * 方法一：通过闭包，传入变量
 * 方法二，通过获取 params 入参，获取前缀作为表名
 */
const verifyPermission = async (ctx, next) =>{
  console.log('校验用户权限');
  // 1.获取参数 { commentId: '1' }
  const [resourceKey] = Object.keys(ctx.params);
  const tableName = resourceKey.replace('Id', '');
  const resourceId = ctx.params[resourceKey];
  const {id} = ctx.user;
  try {
    // 2.检验是否有权限
    const isPermission = await authSerive.checkResource(tableName, resourceId, id);
    if(!isPermission) throw new Error();
    await next();
  } catch (err) {
    const error = new Error(errorType.UNPERMISSION);
    return ctx.app.emit('error', error, ctx);
  }
}

// const verifyPermission = (tableName) =>{
//   return async (ctx, next) =>{
//     console.log('校验用户权限');
//     const {momentId} = ctx.params;
//     const {id} = ctx.user;
//     try {
//       const isPermission = await authSerive.checkMoment(momentId, id);
//       if(!isPermission) throw new Error();
//       await next();
//     } catch (err) {
//       const error = new Error(errorType.UNPERMISSION);
//       return ctx.app.emit('error', error, ctx);
//     }
//   }
// }

module.exports ={
  verifyLogin,
  verifyAuth,
  verifyPermission
}