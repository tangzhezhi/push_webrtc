var express = require('express');
var router = express.Router();
/**
 * 等效于login(router)
 * @type {*|exports}
 */
var login = require("../routes/login")(router);
var chat = require("../routes/chat")(router);
var UserDao = require('../models/user');
var MenuDao =  require('../models/menu');
var ChatRoomDao =  require('../models/chatRoom');

/**
 * 获取redis 客户端
 * @returns {*}
 */
var getRedisClient = function (){
  var redis = require("redis");
  var client = redis.createClient();
  /**
   * 监听错误
   */
  client.on("error", function (err) {
    console.log("Error " + err);
  });
  return client;
}

var getSidFromRedis = function(client,req,callback){
  client.get(req.query.sessionid,function(err,reply){
    if(err){
      console.error("获取session异常："+err)
    }
    else{
      var sessionObj = JSON.parse(reply);
      try {
        req.session.secure = "tang";
        req.session.user = sessionObj;
        callback(err,req);
      } catch (e) {
        console.error("req.session异常："+e)
      }
    }
  });
}


/* GET home page. */
router.get('/', function(req, res) {

  if(req){
    if(req.query.sessionid){
        console.log("sessionid:"+req.query.sessionid);
      var client = getRedisClient();

      getSidFromRedis(client,req,function(err,data){
        if(err){
          console.err(err);
        }
        else{
          if(data.session.user !=null){
            res.render('index', {
              title: '首页',
              user : data.session.user,
              success : data.flash('success').toString(),
              error : data.flash('error').toString()
            });
          }
          else{
            res.redirect("/login");
          }
        }
      });

    }
    else{
      res.redirect("/login");
    }
  }
});


router.get('/index',function(req,res){
  if(req){
    if(req.session.user){
        res.render("index",{title:'欢迎来到首页'});
    }
  }
});


router.post('/getMenu',function(req,res){
  var params = req.body;
  if(params){
    var username = params.username;
    MenuDao.getAllMenu(function(err,menus){
      if(err){
        console.error("查询菜单错误"+err);
        res.json(200, { msg: "查询菜单错误" })
      }
      else{
        if(menus){
          console.log("查询得到菜单::"+menus);
          res.json(200, {"msg":"success",data:menus})
        }
        else{
          console.log("查询不到菜单::");
          res.json(200, "不存在此菜单")
        }
      }
    });
  }
});

router.post('/getRoomInfo',function(req,res){
  var params = req.body;
  if(params){
    var username = params.username;
    ChatRoomDao.getAllChatRoom(function(err,chat_room){
      if(err){
        console.error("查询聊天室错误"+err);
        res.json(200, { msg: "查询聊天室错误" })
      }
      else{
        if(chat_room){
          console.log("查询得到聊天室::"+chat_room);
          res.json(200, {"msg":"success",data:chat_room})
        }
        else{
          console.log("查询不到聊天室::");
          res.json(200, "不存在此聊天室")
        }
      }
    });
  }
});


router.post('/getAllFriends',function(req,res){
  var params = req.body;
  if(params){
    var username = params.username;
    UserDao.getAllFriends(function(err,user_friends){
      if(err){
        console.error("查询用户朋友错误"+err);
        res.json(200, { msg: "查询用户朋友错误" })
      }
      else{
        if(user_friends){
          console.log("查询得到用户朋友::"+user_friends);
          res.json(200, {"msg":"success",data:user_friends})
        }
        else{
          console.log("查询不到用户朋友::");
          res.json(200, "不存在此用户朋友")
        }
      }
    });
  }
});




/* GET home page. */
router.get('/vedio', function(req, res) {

  if(req){
    if(req.query.sessionid){
      console.log("sessionid:"+req.query.sessionid);
      var client = getRedisClient();

      getSidFromRedis(client,req,function(err,data){
        if(err){
          console.err(err);
        }
        else{
          if(data.session.user !=null){
            res.render('vedio', {
              title: '会议室',
              user : data.session.user,
              success : data.flash('success').toString(),
              error : data.flash('error').toString()
            });
          }
          else{
            res.redirect("/login");
          }
        }
      });

    }
  }
});

module.exports = router;
