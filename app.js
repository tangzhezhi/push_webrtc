var express = require('express');
var router = express.Router();
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
var app = express();
var server = require('http').createServer(app);
var routes = require('./routes/index');
//var login = require('./routes/login')(router);
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
//app.listen(3000);
app.set('port',3000);
server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

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

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

    socket.on('subscribe', function(data) {
        console.log("subscribe::"+data.room);
        socket.join(data.room);
    })

    socket.on('unsubscribe', function(data) {
        socket.leave(data.room);
    })

    socket.on("chat_msg",function(data){
        console.log("data::::"+data);
        console.log("fromUserId::::"+ data.fromUserId);
        var fromUserId = data.fromUserId;
        var toUserId = data.toUserId;
        var message = data.message;

        console.log("fromUserId::::"+ fromUserId);
        console.log("toUserId::::"+ toUserId);
        console.log("message::::"+ message);

        socket.broadcast.emit('message', message);

//        socket.broadcast.in("chat_room_"+fromUserId).emit('message', message);
//        socket.broadcast.in("chat_room_"+toUserId).emit('message', message);
    });

    //断开连接callback
    io.on('disconnect', function () {
        console.log('Server has disconnected');
    });
});


var getTime=function(){
    var date = new Date();
    return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
}

var getColor=function(){
    var colors = ['aliceblue','antiquewhite','aqua','aquamarine','pink','red','green',
        'orange','blue','blueviolet','brown','burlywood','cadetblue'];
    return colors[Math.round(Math.random() * 10000 % colors.length)];
}

module.exports = app;
