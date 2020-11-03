const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
var cors = require("cors");


module.exports = function () {
  const app = express();
  app.use(express.static('public'));
  app.set('view engine', 'jade');

  app.use(compression());

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use(methodOverride());

  app.use(cors());


  /* App (Android, iOS) */
  require("../src/web/routes/homeRoute")(app);
  require("../src/web/routes/commentRoute")(app);
  require("../src/web/routes/indexRoute")(app);
  /* Web */
  // require('../src/web/routes/indexRoute')(app);

  /* Web Admin*/
  // require('../src/web-admin/routes/indexRoute')(app);

  return app;
};
