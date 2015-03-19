var chat = function(router){
    router.get('/chat_room', function(req, res) {
        var params = req.body;
        console.log(params);
        res.render('chat', { title: '讨论组' });
    });
}
module.exports = chat;