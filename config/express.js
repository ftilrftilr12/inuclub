module.exports = function(){
  const express = require('express');
  const path = require('path');
  const ejs = require('ejs');
  const bodyParser = require('body-parser');
  const session = require('express-session');
  const db = require('./db');
  const helmet = require('helmet');
  const morgan = require('morgan');
  const app = express();

  const log = require('./log');
  process.on('uncaughtException', function (err) {
    log.logger().error(err);
    console.log('Caught exception: ' + err);
  });
  
  //public/폴더명 생성하기
  app.use('/club_img', express.static(path.join(__dirname, '../public/club_img')));
  app.use('/main_img', express.static(path.join(__dirname, '../public/main_img')));
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname,'../views'));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(session({
    secret: process.env._secret,
    resave: false,
    saveUninitialized: true
  }));

  db.connect(function(err){
    if(err){
      log.logger().warn(err);
      console.log('Unable to connect to DB.');
      process.exit(1);
    }
  });

  app.use(helmet());
  app.use(morgan('short'));

  return app;
};
