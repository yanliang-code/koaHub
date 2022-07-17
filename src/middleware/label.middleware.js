const {
  create, getLabelByName
} = require('../service/label.service')
const verifyLadelExists = async (ctx, next) =>{
  const {labels} = ctx.request.body;
  // 验证标签 labels 是否存在，没存在新建
  const labelList = [];
  for (const name of labels) {
    const labelRes = await getLabelByName(name);
    let label = {name};
    if(!labelRes.length){
      // 不存在创建
      const res = await create(name);
      label.id = res.insertId;
    }else{
      label.id = labelRes[0].id;
    }
    labelList.push(label);
  };
  ctx.labelList = labelList;
  await next();
}

module.exports = {
  verifyLadelExists
}