const {
  create, reply, update, remove, getCommentsByMomentId
} = require('../service/comment.service');

class CommentController{
  async create(ctx, next){
    const {content, momentId} = ctx.request.body;
    const {id} = ctx.user;
    const res = await create(content, momentId, id);
    ctx.body = res;
  }
  async reply(ctx, next){
    // 评论 id
    const {commentId} = ctx.request.params;
    // 评论内容、动态id
    const {content, momentId} = ctx.request.body;
    const {id} = ctx.user;
    // ctx.body = `回复评论---${commentId}--${content}--${momentId}--${id}`;
    const res = await reply(content, momentId, id, commentId);
    ctx.body = res;
  }
  async update(ctx, next){
    const {content} = ctx.request.body;
    const {commentId} = ctx.request.params;
    const res = await update(content, commentId);
    ctx.body = res;
  }
  async remove(ctx, next){
    const {commentId} = ctx.request.params;
    const res = await remove(commentId);
    ctx.body = res;
  }
  async list(ctx, next){
    const {momentId} = ctx.request.query;
    const res = await getCommentsByMomentId(momentId);
    ctx.body = res;
  }
}

module.exports = new CommentController();