var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL || 'mongodb://127.0.0.1:27017';

var api = require('./lib/routes/api');
var embedPostsRoutes = require('./lib/routes/api/embed-post.api.routes');
var aboutPageRoutes = require('./lib/routes/api/about.api.routes');
var contactInfoRoutes = require('./lib/routes/api/contact-info.api.routes');
var instagramFeedRoutes = require('./lib/routes/api/instagram-feed.api.routes');
var configRoutes = require('./lib/routes/api/config.api.routes');
var userPreferencesRoutes = require('./lib/routes/api/user-preferences.api.routes');
var EmbedPost = require('./lib/models/embed-post.model');
var About = require('./lib/models/about.model');
const bannerImageRoutes = require('./lib/routes/api/banner-image.routes');
var authRoutes = require('./lib/routes/api/auth.api.routes');
const compression = require('compression');
const DEBUG = 'DEBUG';
const PROD = 'PROD';
var environment = process.env.DEBUG_ENV ? DEBUG : PROD;

mongoose.connect(MONGODB_CONNECTION_URL);

var app = module.exports = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('jade').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /src
//app.use(favicon(path.join(__dirname, 'src', 'favicon.ico')));
app.use(logger('dev'));

app.use(cookieParser());
app.use(compression({
  level: 9,
}));
app.use(express.static(path.join(__dirname, './lib/images/')));
app.get('*.bundle.js', express.static(path.join(__dirname, '../client/dist/')));
app.get('*.bundle.css', express.static(path.join(__dirname, '../client/dist/')));
app.get('*.ico', express.static(path.join(__dirname, '../client/dist/')));
app.get(['*.ttf', '*.woff2', '*.woff'], express.static(path.join(__dirname, '../client/dist/')));
app.get('*.svg', express.static(path.join(__dirname, '../client/dist/')));

app.use('/images', express.static(path.resolve(__dirname, './lib/images/')));
app.use('/api', api);
app.use('/api/embedPosts', embedPostsRoutes);
app.use('/api/about', aboutPageRoutes);
app.use('/api/contactInfo', contactInfoRoutes);
app.use('/api/bannerImage', bannerImageRoutes);
app.use('/api/instagramFeed', instagramFeedRoutes);
app.use('/api/config', configRoutes);
app.use('/api/userPreferences', userPreferencesRoutes);
app.use('/api/auth/', authRoutes);
app.get('/images/**/*', express.static(path.resolve(__dirname, './lib/images/')));
app.get('*', (req, res) => {
  let postTitle, description, imageUrl = undefined;
  const basePath = 'http://jruttenberg.io'  
  const url = `${basePath}${req.originalUrl}`;
  if (req.query.id) {
    // viewing a post, get specific post's information
    // to populate index.jade template's meta og tags
    EmbedPost.findOne({_id: req.query.id}, (err, post) => {
      if (!err) {
        postTitle = post.title;
        description = post.description;
        imageUrl = `${basePath}/${post.images[post.thumbnailIndex]}`;
        if (!imageUrl) {
          // no thumbnail image for the current EmbedPost,
          // use About info
          About.findOne({}, (err, about) => {
            if (!err) {
              imageUrl = `${basePath}/${about.image}`;
            }
          })
        }        
      }
      res.render(path.join(__dirname, './lib/views/index.jade'), {
        postTitle, description, imageUrl, url
      });      
    });
  } else {
    // not viewing a post, use About image for index.jade
    // template's meta og tags
    About.findOne({}, (err, about) => {
      if (!err) {
        imageUrl = `${basePath}/${about.image}`;
      }
      res.render(path.join(__dirname, './lib/views/index.jade'), {
        postTitle, description, imageUrl, url
      });         
    }); 
  }
});



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
