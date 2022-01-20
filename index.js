var fs = require('fs');
var Koa = require('koa');
var Router = require('koa-router');
var koaBody = require('koa-body');

var app = new Koa();
var router = new Router();

const PORT = process.env.PORT || 3000;

var filePath
var fileType

router.get('/', (ctx, next) => {
  // ctx.router available  try {
    if (filePath && fs.existsSync(filePath)) {
        ctx.response.attachment(filePath);
        ctx.response.body = fs.createReadStream(filePath);
        ctx.response.type = fileType
      } else {
        ctx.throw(400, "Requested file not found on server");
      }
});

router.post('/',koaBody({multipart: true}), (ctx, next) => {
    const file = ctx.request.files?.['upload'];
    filePath = file.path
    fileType = file.type
    ctx.body = 'Success';
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT);