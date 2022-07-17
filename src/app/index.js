/**
 * 全局 app 入口
 * 负责注册路由中间件
 */
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const userRouter = require('../router/user.router');
const authRouter = require('../router/auth.router');
const errorHanlde = require('./error-handle');
const {
  useRoutes
} = require('../router');

const app = new Koa();
app.useRoutes = useRoutes;

// 注册处理请求体中 json 数据的中间件
app.use(bodyParser());

// 注册自定义路由 -- 繁琐版
// app.use(userRouter.routes())
// app.use(userRouter.allowedMethods());
// app.use(authRouter.routes())
// app.use(authRouter.allowedMethods());
// 注册自定义路由 -- 简介版
app.useRoutes();

// 全局监听 error 事件，统一进行客户端请求响应
app.on('error', errorHanlde);

module.exports = app;