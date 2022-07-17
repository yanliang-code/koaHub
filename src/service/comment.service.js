const connection = require('../app/database');
class CommentService{
  async create(content, momentId, userId){
    const statement = `INSERT INTO comment (content, moment_id, user_id) VALUES(?, ?, ?);`;
    const res = await connection.execute(statement, [content, momentId, userId]);
    return res[0];
  }
  async reply(...args){
    const statement = `INSERT INTO comment (content, moment_id, user_id, comment_id) VALUES(?, ?, ?, ?);`; 
    const res = await connection.execute(statement, args);
    return res[0];
  }
  async update(content, commentId){
    const statement = `UPDATE comment SET content = ? WHERE id = ?;`;
    const res = await connection.execute(statement, [content, commentId]);
    return res[0];
  }
  async remove(commentId){
    const statement = `DELETE FROM comment where id = ?;`;
    const res = await connection.execute(statement, [commentId]);
    return res[0];
  }
  async getCommentsByMomentId(momentId){
    // 通过动态 id 获取评论集合
    const statement = `
      SELECT c.id, c.content, c.comment_id commentId,
        JSON_OBJECT('id', u.id, 'name', u.name) user
      FROM comment c
      LEFT JOIN user u
      ON c.user_id = u.id
      WHERE c.moment_id = ?;
    `;
    const res = await connection.execute(statement, [momentId]);
    return res[0];
  }
}

module.exports = new CommentService();