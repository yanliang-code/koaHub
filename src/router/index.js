const fs = require('fs');

const useRoutes = function(){
  fs.readdirSync(__dirname).forEach(file =>{
    if(file === 'index.js') return;
    // 同步读取此文件所在目录的所有文件名
    console.log(file);
    const router = require(`./${file}`);
    this.use(router.routes());
    this.use(router.allowedMethods());
  })
}

module.exports = {
  useRoutes
}