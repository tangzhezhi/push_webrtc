var mongodb = require('./db');
var DateUtil =  require('../libs/date_util');

function ChatRecords(chat_records) {
	this.id = chat_records.id;
    this.userid = chat_records.userid;
    this.fromUserid = chat_records.fromUserid;
    this.toUserId = chat_records.toUserId;
    this.msg = chat_records.msg;
    this.recordDate = chat_records.recordDate;
    this.recordTime = chat_records.recordTime;
};


ChatRecords.getTop20ChatRecords = function getTop20ChatRecords(params,callback) {
		mongodb.collection('chat_records', function(err, collection) {
			if (err) {
				return callback(err);
			}

            var query = {
                userid: parseInt(params.self_userid),
                chat_userid:parseInt(params.other_userid),
                record_date:DateUtil.NowYMDDateString()
            };

            var projection = {
                "msg_list":{"$slice":-20}
            };

//            db.chat_records.find({userid:1},{msg_list:{$slice:-2}}).sort({record_date:-1})

			collection.findOne(query,projection,function(err, docs) {
				if (err) {
					callback(err, null);
				}
				var Chat_Records = {};
				if(docs){
                    callback(null, docs);
				}
                else{
                    callback(err, null);
                }
			});
		});
};


ChatRecords.save = function save(params,callback){

    var chat_record = {
        userid:parseInt(params.userid),
        record_date:params.recordDate,
        msg:params.msg,
        from_userid:parseInt(params.fromUserid),
        to_userid:parseInt(params.toUserId),
        record_time:params.recordTime
    }


    mongodb.collection('chat_records', function(err, collection) {
        if (err) {
            return callback(err);
        }

        var query = {
            userid: parseInt(chat_record.userid),
            chat_userid:parseInt(chat_record.to_userid),
            record_date:chat_record.record_date
        };

        var query2 = {
            userid: parseInt(chat_record.to_userid),
            chat_userid:parseInt(chat_record.userid),
            record_date:chat_record.record_date
        };

        collection.findOne(query,function(err, docs) {
            if(docs){
                collection.update({chat_userid:parseInt(chat_record.to_userid),record_date:chat_record.record_date},
                    {"$push":
                        {"msg_list":
                            {record_time:chat_record.record_time,msg:chat_record.msg,from_userid:chat_record.from_userid,to_userid:chat_record.to_userid}
                        }
                    },function(err){
                        callback(err, chat_record);//成功！返回更新的信息
                    }
                );
            }
            else{
                var insert_chart =
                {
                    "userid" :  parseInt(chat_record.userid),
                    "chat_userid":parseInt(chat_record.to_userid),
                    "record_date" : chat_record.record_date,
                    "msg_list" : [
                    {
                        "record_time" : chat_record.record_time,
                        "msg" : chat_record.msg,
                        "from_userid" : parseInt(chat_record.from_userid),
                        "to_userid" : parseInt(chat_record.to_userid)
                    }
                ]
               };
                collection.insert(insert_chart, {safe: true}, function (err, insert_chart) {
                    callback(err, insert_chart);//成功！返回插入的信息
                });
            }
        });


        collection.findOne(query2,function(err, docs) {
            if(docs){
                collection.update({chat_userid:parseInt(chat_record.userid),record_date:chat_record.record_date},
                    {"$push":
                    {"msg_list":
                    {record_time:chat_record.record_time,msg:chat_record.msg,from_userid:chat_record.from_userid,to_userid:chat_record.to_userid}
                    }
                    },function(err){
                        callback(err, chat_record);//成功！返回更新的信息
                    }
                );
            }
            else{
                var insert_chart =
                {
                    "userid" :  parseInt(chat_record.to_userid),
                    "chat_userid":parseInt(chat_record.userid),
                    "record_date" : chat_record.record_date,
                    "msg_list" : [
                        {
                            "record_time" : chat_record.record_time,
                            "msg" : chat_record.msg,
                            "from_userid" : parseInt(chat_record.from_userid),
                            "to_userid" : parseInt(chat_record.to_userid)
                        }
                    ]
                };
                collection.insert(insert_chart, {safe: true}, function (err, insert_chart) {
                    callback(err, insert_chart);//成功！返回插入的信息
                });
            }
        });




    });
};

module.exports = ChatRecords;