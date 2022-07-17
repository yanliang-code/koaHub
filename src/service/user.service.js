const connection = require('../app/database');

class UserService{
  async create(user){
    const {name, password} = user;
    // 将 user 存储到数据库中
    const statement = `INSERT INTO user (NAME, PASSWORD) VALUES(?, ?);`;
    const res = await connection.execute(statement, [name, password]);
    return res;
  }
  async getUserByName(name){
    const statement = `SELECT * FROM user WHERE user.name = ?;`;
    const res = await connection.execute(statement, [name]);
    return res[0];
  }
  async updateAvatarInfo(avatarUrl, id){
    const statement = `UPDATE user SET avatar_url = ? WHERE id = ?;`;
    const res = await connection.execute(statement, [avatarUrl, id]);
    return res[0];
  }
}

module.exports = new UserService();