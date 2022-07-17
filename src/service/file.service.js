const connection = require('../app/database');

class fileService{
  async createAvatarInfo(...args){
    const statement = `INSERT INTO avatar (filename, mimetype, size, user_id) VALUES(?, ?, ?, ?);`;
    const res = await connection.execute(statement, args);
    return res[0];
  }
  async getAvatarByUserId(userId){
    const statement = `SELECT * FROM avatar WHERE user_id = ?;`;
    const res = await connection.execute(statement, [userId]);
    return res[0];
  }
  async createPictureInfo(...args){
    const statement = `INSERT INTO file (filename, mimetype, size, user_id, moment_id) VALUES(?, ?, ?, ?, ?);`;
    const res = await connection.execute(statement, args);
    return res[0];
  }
  async getPictureByFileName(fileName){
    const statement = `SELECT * FROM file WHERE filename = ?;`;
    const res = await connection.execute(statement, [fileName]);
    return res[0];
  }
  asy
}

module.exports = new fileService();