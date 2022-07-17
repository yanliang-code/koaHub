const Router = require('koa-router');
const {
  verifyAuth, verifyPermission
} = require('../middleware/auth.middleware');
const {
  create, detail, list, update, remove, addLabels, pictureInfo
} = require('../controller/moment.controller')
const {
  verifyLadelExists
} = require('../middleware/label.middleware')

const momentRouter = new Router({prefix: '/moment'});

// 创建动态
momentRouter.post('/', verifyAuth, create)
// 获取某条动态
momentRouter.get('/:momentId', detail)
// 分页获取全部动态
momentRouter.get('/', list)
// 更新某条动态
// 验证是否登陆 --- 验证是否有更新权限 --- 更新
momentRouter.patch('/:momentId', verifyAuth, verifyPermission, update)
// 删除某条动态
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, remove)
// 给某条动态增加标签
momentRouter.post('/:momentId/labels', verifyAuth, verifyPermission, verifyLadelExists, addLabels)

// 动态配图
// 由于一个动态可能配置多个图，通过图片唯一名称来获取图片地址
momentRouter.get('/images/:fileName', pictureInfo)

module.exports = momentRouter;