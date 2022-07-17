const connection = require('../app/database');

class labelService{
  async create(name){
    const statement = `INSERT INTO label (name) VALUES(?);`;
    const res = await connection.execute(statement, [name]);
    return res[0];
  }
  async getLabelByName(name){
    const statement = `SELECT * FROM label WHERE name = ?;`;
    const res = await connection.execute(statement, [name]);
    return res[0];
  }
  async list(offset, limit){
    const statement = `SELECT * FROM label LIMIT ?, ?;`;
    const res = await connection.execute(statement, [offset, limit]);
    return res[0];
  }
}

module.exports = new labelService();