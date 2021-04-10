var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const API = require('call-of-duty-api')();
const rateLimit = require("express-rate-limit");
require('dotenv').config();

var indexRouter = require('./routes/index');
var matchesRouter = require('./routes/matches');
var statsRouter = require('./routes/stats');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  message: "You've sent too many requests to WZ Ranks servers in 5 miutes, please wait a few minutes before trying again.",
  handler: function(req, res) {
    res.json({
      error: true,
      msg: "You've sent too many requests to WZ Ranks servers in 5 miutes, please wait a few minutes before trying again."
    });
  }
});
app.use("/stats/", apiLimiter);
app.use("/matches/", apiLimiter);

app.use('/', indexRouter);
app.use('/matches', matchesRouter);
app.use('/stats', statsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

try {
  API.login(process.env.ACTI_EMAIL, process.env.ACTI_PASS);
} catch(Error) {
  console.log(Error);
}


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
