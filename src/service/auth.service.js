const connection = require('../app/database');


class AuthService{
  async checkResource(tableName, id, userId){
    const statement = `SELECT * FROM ${tableName} m WHERE m.id = ? AND m.user_id= ?`;
    const res = await connection.execute(statement, [id, userId]);
    return !!res[0].length;
  }
}

module.exports = new AuthService();