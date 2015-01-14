var redis = require("redis");
var redis_local = function (){
    var client = redis.createClient();
    /**
     * 监听错误
     */
    client.on("error", function (err) {
        console.log("Error " + err);
    });
    return client;
}

module.exports = redis_local;