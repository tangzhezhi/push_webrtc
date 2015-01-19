var UserDao = require("../models/user");
var login = function(router){

    /* GET home page. */
    router.get('/login', function(req, res) {
        res.render('login', { title: '登录' });
    });

    //router.post('/login',checkLogin);

    router.post('/login',function(req,res){
        var params = req.body;
        if(params){
            var username = params.username;
            var password = params.password;
            console.log("username::"+username+"password::"+password);
            UserDao.get(params,function(err,user){
                if(err){
                    console.error("查询用户错误"+err);
                    res.json(200, { msg: "查询用户错误" })
                }
                else{
                    if(user){
                        console.log("查询得到user::"+user);
                        req.session.user = user;
                        res.json(200, "success")
                    }
                    else{
                        console.log("查询不到user::");
                        res.json(200, "不存在此用户")
                    }
                }
            });
        }
    });
}


module.exports = login;