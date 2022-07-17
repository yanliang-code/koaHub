const connection = require('../app/database');
const {
  APP_HOST, APP_PORT
} = require('../app/config');

const sqlFrame = `
SELECT
  m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
  JSON_OBJECT('userId', u.id, 'userName', u.name) author
FROM moment m 
LEFT JOIN user u ON m.user_id = u.id
`;

class MomentService{
  async create(content, userId){
    const statement = `INSERT INTO moment (content, user_id) VALUES (?, ?);`;
    const res = await connection.execute(statement, [content, userId]);
    return res[0];
  }
  async getMomentById(momentId){
    /**
     * 问题：
     * left join 是采用前面 sql 执行的结果条数，再和后面表进行匹配，
     * 动态与评论左连接后，出现三条；三条数据再与标签匹配，就会重复三次与标签匹配的结果，出现问题
     * 解决：
     *  把其中一个字段的查询，提出来作为子查询获取
     */
    const statement = `
    SELECT
      m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
      JSON_OBJECT('userId', u.id, 'userName', u.name, 'avatarUrl', u.avatar_url) author,
      IF( COUNT(c.id), JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'content', c.content, 'commentId', c.comment_id, 'user', JSON_OBJECT('userId', cu.id, 'userName', cu.name, 'avatarUrl', cu.avatar_url))), NULL) comments,
      (
        SELECT 
        (
          IF( COUNT(ml.label_id), JSON_ARRAYAGG(JSON_OBJECT('id', l.id, 'name', l.name)), NULL)
        ) 
        FROM moment_label ml LEFT JOIN label l ON ml.label_id = l.id WHERE ml.moment_id = m.id
      ) labels,
      (SELECT JSON_ARRAYAGG(CONCAT('${APP_HOST}:${APP_PORT}/moment/images/', f.filename)) FROM file f WHERE m.id = f.moment_id ) images
    FROM moment m 
    LEFT JOIN user u ON m.user_id = u.id
    LEFT JOIN comment c ON c.moment_id = m.id
    LEFT JOIN user cu ON cu.id = c.user_id
    WHERE m.id = ?
    GROUP BY m.id;
    `;
    const res = await connection.execute(statement, [momentId]);
    return res[0];
  }
  async getMomentList(offset, size){
    // 使用子查询查询评论个数
    const statement = `
    SELECT
      m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
      JSON_OBJECT('userId', u.id, 'userName', u.name) author,
      (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
      (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
      (SELECT JSON_ARRAYAGG(CONCAT('${APP_HOST}:${APP_PORT}/moment/images/', f.filename)) FROM file f WHERE m.id = f.moment_id ) images
    FROM moment m 
    LEFT JOIN user u ON m.user_id = u.id
    GROUP BY m.id
    LIMIT ?, ?;
    `
    const res = await connection.execute(statement, [offset, size]);
    return res[0];
  }
  async update(content, momentId){
    const statement = `UPDATE moment SET content = ? WHERE id = ?;`
    const res = await connection.execute(statement, [content, momentId]);
    return res[0];
  }
  async remove(momentId){
    const statement = `DELETE FROM moment WHERE id = ?;`
    const res = await connection.execute(statement, [momentId]);
    return res[0];
  }
  async addLabels(momentId, labelId){
    const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES(?, ?);`
    const res = await connection.execute(statement, [momentId, labelId]);
    return res[0];
  }
  async hasLabelId(momentId, labelId){
    const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;`;
    const res = await connection.execute(statement, [momentId, labelId]);
    return !!res[0].length;
  }
}

module.exports = new MomentService();