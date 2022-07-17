const {
  create, list
} = require('../service/label.service');

class labelController{
  async create(ctx, next){
    const {name} = ctx.request.body;
    const res = await create(name);
    ctx.body = res;
  }
  async list(ctx, next){
    const {offset, limit} = ctx.request.query;
    const res = await list(offset, limit);
    ctx.body = res;
  }
}

module.exports = new labelController();