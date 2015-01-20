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
var server = require('http').createServer(app);
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
//app.listen(3000);
app.set('port',3000);
server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

console.log("something happening");


var io = require('socket.io').listen(server);
io.on('connection', function (socket) {
    socket.emit('open');//通知客户端已连接
    // 打印握手信息
    // console.log(socket.handshake);

    // 构造客户端对象
    var client = {
        socket:socket,
        name:false,
        color:getColor()
    }

    // 对message事件的监听
    socket.on('message', function(msg){
        var obj = {time:getTime(),color:client.color};

        // 判断是不是第一次连接，以第一条消息作为用户名
        if(!client.name){
            client.name = msg;
            obj['text']=client.name;
            obj['author']='System';
            obj['type']='welcome';
            console.log(client.name + ' login');

            //返回欢迎语
            socket.emit('system',obj);
            //广播新用户已登陆
            socket.broadcast.emit('system',obj);
        }else{

            //如果不是第一次的连接，正常的聊天消息
            obj['text']=msg;
            obj['author']=client.name;
            obj['type']='message';
            console.log(client.name + ' say: ' + msg);

            // 返回消息（可以省略）
            socket.emit('message',obj);
            // 广播向其他用户发消息
            socket.broadcast.emit('message',obj);
        }
    });

    //监听出退事件
    socket.on('disconnect', function () {
        var obj = {
            time:getTime(),
            color:client.color,
            author:'System',
            text:client.name,
            type:'disconnect'
        };

        // 广播用户已退出
        socket.broadcast.emit('system',obj);
        console.log(client.name + 'Disconnect');
    });

});


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
