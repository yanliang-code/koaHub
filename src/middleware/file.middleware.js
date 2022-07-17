const path = require('path');
const koaMulter = require('koa-multer');
const jimp = require('jimp')

const {AVATAR_PATH, PICTURE_PATH} = require('../constants/file-path');

const upload = new koaMulter({
  dest: AVATAR_PATH
})

const avatarHanlder = upload.single('avatar');

const picture = new koaMulter({
  dest: PICTURE_PATH
})

const pictureHanlder = picture.array('picture', 9);

const pictureResize = async (ctx, next) =>{
  const files = ctx.req.files;
  for (const file of files) {
    const destPath = path.join(file.destination, file.filename);
    jimp.read(file.path).then(image =>{
      image.resize(1280, jimp.AUTO).write(`${destPath}-large`);
      image.resize(640, jimp.AUTO).write(`${destPath}-middle`);
      image.resize(320, jimp.AUTO).write(`${destPath}-small`);
    })
  }
  await next();
}

module.exports = {
  avatarHanlder,
  pictureHanlder,
  pictureResize
}