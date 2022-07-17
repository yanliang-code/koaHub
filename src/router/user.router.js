/**
 * 创建路由
 */
const Router = require('koa-router');
// 引入路由对应的处理控制器
const {
  create, avatarInfo
} = require('../controller/user.controller')
// 其他中间件
const {
  verifyUser, handlePassword
} = require('../middleware/user.middleware')
const {
  verifyAuth
} = require('../middleware/auth.middleware')

const userRouter = new Router({prefix: '/users'});

// 用户注册
userRouter.post('/', verifyUser, handlePassword, create)
// 获取用户头像
// 由于用户和头像是一对一关系，所以通过 userId 就能获取到唯一的头像地址
userRouter.get('/:userId/avatar', avatarInfo)

module.exports = userRouter;