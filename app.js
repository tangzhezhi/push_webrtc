var express = require('express');
var router = express.Router();
var html = require('html');
var ejs = require('ejs');
var path = require('path');
var easyrtc = require("easyrtc");           // EasyRTC external module
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var flash = require('connect-flash');
var app = express();
var server = require('http').createServer(app);
var routes = require('./routes/index');
var ChatRecordsDao =  require('./models/chatRecords');
var DateUtil =  require('./libs/date_util');
// view engine setup
app.engine('html',ejs.__express);
app.set('view engine', 'html');
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
    store: new MongoStore({
        db:settings.db,
        collection:'session'
    }),
    key: 'jsessionid'
}));


app.use('/', routes);
//app.listen(3000);
app.set('port',8080);
server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

console.log("something happening");

/// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

/// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function(err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}

// production error handler
// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});

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

        //socket.broadcast.emit('message', message);

        socket.broadcast.in("chat_room_"+fromUserId).emit('message', data);
        socket.broadcast.in("chat_room_"+toUserId).emit('message', data);

        var ChatRecordsParams1 = {
           "userid": fromUserId,
            "fromUserid":fromUserId,
            "toUserId":toUserId,
            "msg":message,
            "recordDate":DateUtil.NowYMDDateString(),
            "recordTime":DateUtil.NowHmsTimeString()

        }

         ChatRecordsDao.save(ChatRecordsParams1,function(err,result){
            console.log(result);
        });


    });

    //断开连接callback
    io.on('disconnect', function () {
        console.log('Server has disconnected');
    });
});

var rtc = easyrtc.listen(app, io);


//
//var WebSocketServer = require('ws').Server,
//    wss = new WebSocketServer({server: server});
//
//// 存储socket的数组，这里只能有2个socket，每次测试需要重启，否则会出错
//var wsc = [],
//    index = 1;
//
//// 有socket连入
//wss.on('connection', function(ws) {
//    console.log('connection');
//
//    // 将socket存入数组
//    wsc.push(ws);
//
//    // 记下对方socket在数组中的下标，因为这个测试程序只允许2个socket
//    // 所以第一个连入的socket存入0，第二个连入的就是存入1
//    // otherIndex就反着来，第一个socket的otherIndex下标为1，第二个socket的otherIndex下标为0
//    var otherIndex = index--,
//        desc = null;
//
//    if (otherIndex == 1) {
//        desc = 'first socket';
//    } else {
//        desc = 'second socket';
//    }
//
//    // 转发收到的消息
//    ws.on('message', function(message) {
//        var json = JSON.parse(message);
//        console.log('received (' + desc + '): ', json);
//
//        wsc[otherIndex].send(message, function (error) {
//            if (error) {
//                console.log('Send message error (' + desc + '): ', error);
//            }
//        });
//    });
//});




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
