var express = require('express');
var router = express.Router();
/**
 * 等效于login(router)
 * @type {*|exports}
 */
var login = require("../routes/login")(router);
var User = require('../models/user');

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
