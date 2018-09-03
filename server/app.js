const express = require('express');

const middlewares = require('./middlewares');
const router = require('./router');
const core = require('./core');
const storage = require('./storage')
const init = require('./init');

init(storage, core);

module.exports = (app = express()) => {
  app.use(middlewares.json);
  app.use(middlewares.urlencoded);
  app.use(middlewares.cors);
  app.use(middlewares.multipart);
  app.use('/api/v1', router);

  return app;
};
