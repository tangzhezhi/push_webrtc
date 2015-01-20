var app = require('../app');
var chat = function(router){
    var io = require('socket.io').listen(app.server);
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

    router.get('/chat_room', function(req, res) {
        var params = req.body;
        console.log(params);

        if(params){

        }
        res.render('chat', { title: '讨论组' });
    });
}




module.exports = chat;