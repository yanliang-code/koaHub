/**
 * 路由对应的处理函数入口
 */
const fs = require('fs');

const { AVATAR_PATH } = require('../constants/file-path');
const userSerive = require('../service/user.service');
const fileService = require('../service/file.service')
class UserController{
  async create(ctx, next){
    // 处理用户传递的参数
    const user = ctx.request.body;
    console.log(user);
    // 查询数据库 --- service 层处理
    const res = await userSerive.create(user);
    // 返回结果
    ctx.body = res;
  }
  async avatarInfo(ctx, next){
    // 处理用户传递的参数
    const {userId} = ctx.request.params;
    console.log(userId);
    let res = await fileService.getAvatarByUserId(userId);
    res = res.pop();
    // const res = await userSerive.create(user);
    // 设置响应头 content-type，告知浏览器解析方式
    ctx.response.set('content-type', res.mimetype);
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${res.filename}`);
  }
}

module.exports = new UserController();