const fs = require('fs');

const {PICTURE_PATH} = require('../constants/file-path');
const {
  create, getMomentById, getMomentList, update, remove, addLabels, hasLabelId
} = require('../service/moment.service');
const {
  getPictureByFileName
} = require('../service/file.service')

class MomentController{
  async create(ctx, next){
    // 1.获取入参 content
    const { content } = ctx.request.body;
    const userId = ctx.user.id;
    // 2.插入数据库
    const res = await create(content, userId);
    ctx.body = res;
  };
  async detail(ctx, next){
    // 获取 momentId
    const {momentId} = ctx.params;
    // 数据库查询
    const res = await getMomentById(momentId);
    ctx.body = res;
  }
  async list(ctx, next){
    // 获取分页信息
    const {offset, size} = ctx.query;
    const res = await getMomentList(offset, size);
    ctx.body = res;
  }
  async update(ctx, next){
    const {momentId} = ctx.params;
    const {content} = ctx.request.body;
    const res = await update(content, momentId);
    // 更新动态内容
    ctx.body = res;
  }
  async remove(ctx, next){
    const {momentId} = ctx.params;
    const res = await remove(momentId);
    ctx.body = res;
  }
  async addLabels(ctx, next){
    const {momentId} = ctx.params;
    for(const label of ctx.labelList){
      const res = await hasLabelId(momentId, label.id);
      if(!res){
        await addLabels(momentId, label.id);
      }
    }
    ctx.body = `给动态添加标签成功`;
  }
  async pictureInfo(ctx, next){
    let {fileName} = ctx.params;
    const {type} = ctx.query;
    const [res] = await getPictureByFileName(fileName);
    const types = ['large', 'middle', 'small'];
    if(types.some(item => item === type)){
      fileName += `-${type}`;
    }
    ctx.response.set('content-type', res.mimetype)
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${fileName}`);
  }
}

module.exports = new MomentController();