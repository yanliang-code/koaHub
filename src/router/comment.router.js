const koaRouter = require('koa-router');
const commentRouter = new koaRouter({prefix: '/comment'});
const {
  verifyAuth
} = require('../middleware/auth.middleware')
const {
  create, reply, update, remove, list
} = require('../controller/comment.controller');
const {
  verifyPermission
} = require('../middleware/auth.middleware');

// 发表评论接口
commentRouter.post('/', verifyAuth, create)

// 回复评论接口
commentRouter.post('/:commentId/reply', verifyAuth, reply)

// 修改评论接口 --- 验证登陆、验证用户权限、更新
commentRouter.patch('/:commentId', verifyAuth, verifyPermission, update)

// 删除评论
commentRouter.delete('/:commentId', verifyAuth, verifyPermission, remove)

// 获取评论(根据动态id)
commentRouter.get('/', list)

module.exports = commentRouter;