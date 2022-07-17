// 工程主入口
const app = require('./app');
const config = require('./app/config');
// require('./app/database')


app.listen(config.APP_PORT, () =>{
  console.log(`服务器${config.APP_PORT}端口启动~~~`);
})