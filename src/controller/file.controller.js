const {
  createAvatarInfo, createPictureInfo
} = require('../service/file.service')
const{
  APP_HOST, APP_PORT,
} = require('../app/config')
const {
  updateAvatarInfo
} = require('../service/user.service')

class fileController{
  async createAvatarInfo(ctx, next){
    const {filename, mimetype, size} = ctx.req.file;
    const {id} = ctx.user;
    // 插入头像信息
    const res = await createAvatarInfo(filename, mimetype, size, id);

    // 更新用户的头像字段
    // http://localhost:8000/users/4/avatar
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`
    await updateAvatarInfo(avatarUrl, id)

    ctx.body = `用户头像上传成功~`;
  }
  async createPictureInfo(ctx, next){
    const files = ctx.req.files;
    const {momentId} = ctx.request.query;
    const {id} = ctx.user;
    for (const file of files) {
      const {filename, mimetype, size} = file;
      await createPictureInfo(filename, mimetype, size, id, momentId)
    }
    ctx.body = `动态配图上传成功~`;
  }
}

module.exports = new fileController();