var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

/**
 * websocket設定
 */
app.io = require("socket.io")();
require('./sockets/marubatsu')(app.io);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * HTTPリクエストのログ設定
 */
//app.use(logger('dev')); // 色付け(ANSIエスケープシーケンス)は不要なのでコメントアウト
app.use(logger('combined'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../vue/dist')));


/**
 * ルーティング設定
 */
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error(`[${Date()}] : ${err.message}`)
  // エラー内容をログに出力
  console.error(err.stack)

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * 未処理の例外をcatch
 *
 * ここではエラーページ等を返却でないので、
 * 可能な限り上のerror handlerで処理する方が良い。
 * 現状はsocket.io内での例外をnextする方法が分からないので、ここでcatchする。
 */
process.on('uncaughtException', function(err) {
  console.log(`[${Date()}] : uncaughtException`);
  console.log(err);
});

module.exports = app;
