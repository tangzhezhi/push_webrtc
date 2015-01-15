var express = require('express');
var html = require('html');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session    = require('express-session');
//var MongoStore = require('connect-mongo')(session);
var RedisStore = require('connect-redis')(session);
var settings = require('./settings'); 
var flash = require('connect-flash');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

//设置跨域访问
//app.all('*', function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "X-Requested-With");
//    res.header("Access-Control-Allow-Methods","POST,GET");
//    res.header("X-Powered-By",' 3.2.1')
//    next();
//});


//app.use(session({
//    secret: settings.cookieSecret,
//    store: new MongoStore({
//        db: settings.db
//    })
//}));

app.use(session({
    secret: settings.cookieSecret,
    cookie: { maxAge: 2628000000 },
    store: new RedisStore({
        host: 'localhost', // optional
        port: 6379// optional
    }),
    key: 'jsessionid'
}));





app.use(function(req, res, next){
  console.log("app.usr local");
  res.locals.user = req.session.user;
  res.locals.post = req.session.post;
  var error = req.flash('error');
  res.locals.error = error.length ? error : null;
 
  var success = req.flash('success');
  res.locals.success = success.length ? success : null;
  next();
});

app.use('/', routes);
app.listen(3000);
console.log("something happening");


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
