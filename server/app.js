var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var index = require('./lib/routes/index');
var api = require('./lib/routes/api');
var embedPostsRoutes = require('./lib/routes/api/embed-post.api.routes');
var aboutPageRoutes = require('./lib/routes/api/about.api.routes');
var authRoutes = require('./lib/routes/api/auth.api.routes');

mongoose.connect('mongodb://127.0.0.1:27017');

var app = module.exports = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('src/static'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /src
//app.use(favicon(path.join(__dirname, 'src', 'favicon.ico')));
app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/src')));
app.use('/', index);
app.use('/interface', index);
app.use('/interface/*', index);
app.use('/auth/login', index);
app.use('/api', api);
app.use('/api/embedPosts', embedPostsRoutes);
app.use('/api/about', aboutPageRoutes)
app.use('/api/auth', authRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
