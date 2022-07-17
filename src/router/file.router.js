const koaRouter = require('koa-router');
const {
  verifyAuth
} = require('../middleware/auth.middleware')
const {
  avatarHanlder, pictureHanlder, pictureResize
} = require('../middleware/file.middleware')
const {
  createAvatarInfo, createPictureInfo
} = require('../controller/file.controller')

const fileRouter = new koaRouter({prefix: '/upload'});

// 上传用户头像
fileRouter.post('/avatar', verifyAuth, avatarHanlder, createAvatarInfo);

// 上传动态配图
fileRouter.post('/picture', verifyAuth, pictureHanlder, pictureResize, createPictureInfo)

module.exports = fileRouter;