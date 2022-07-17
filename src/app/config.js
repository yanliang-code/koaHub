// 读取工程配置文件

const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

const pathResolve = relativePath => path.resolve(__dirname, relativePath);

dotenv.config();

console.log(process.env.APP_PORT);

const PRIVATE_KEY = fs.readFileSync(pathResolve('./keys/private.key'));
const PUBLIC_KEY = fs.readFileSync(pathResolve('./keys/public.key'));

module.exports = {
  APP_HOST,
  APP_PORT,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD
} = process.env

module.exports.PRIVATE_KEY = PRIVATE_KEY;
module.exports.PUBLIC_KEY = PUBLIC_KEY;