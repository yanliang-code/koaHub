const koaRouter = require('koa-router');
const {
  verifyAuth
} = require('../middleware/auth.middleware')
const {
  create, list
} = require('../controller/label.controller')

const labelRouter = new koaRouter({prefix: '/label'});

// 新建标签
labelRouter.post('/', verifyAuth, create)
// 查询
labelRouter.get('/', list)

module.exports = labelRouter;