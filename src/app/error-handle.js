/**
 * 全局错误处理
 */
const errorType = require('../constants/error-types');

module.exports = (error, ctx)=>{
  let status, message;
  switch (error.message) {
    case errorType.NAME_OR_PASSWORD_REQUIRE:
      status = 400;
      message = '用户名和密码不能为空';
      break;
    case errorType.USER_ALREADY_EXISTS:
      status = 409; // conflict
      message = '用户名已存在';
      break;
    case errorType.USER_NO_EXISTS:
      status = 400; // 用户名不存在
      message = '用户名不存在';
      break;
    case errorType.PASSWORD_IS_INCORRENT:
      status = 400; // 密码不正确
      message = '密码不正确';
      break;
    case errorType.UNAUTHORIZATION:
      status = 401; // 
      message = '无效 token';
      break;
    case errorType.UNPERMISSION:
      status = 401; // 参数错误
      message = "您不具备操作的权限~";
      break;
  
    default:
      status = 404;
      message = 'NOT FOUND'
      break;
  }

  ctx.status = status;
  ctx.body = message;
}