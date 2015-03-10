var chat_room = function(router){

    /* GET chat_room page. */
    router.get('/chat_room', function(req, res) {
        res.render('chat', { title: '聊天室' });
    });

    router.post('/chat_room',function(req,res){
        var params = req.body;
        console.log("chat_room::params::"+params);
    });
}

module.exports = chat_room;