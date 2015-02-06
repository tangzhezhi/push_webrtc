var mongodb = require('./db');

function ChatRecords(chat_records) {
	this.id = chat_records.id;
    this.userid = chat_records.userid;
    this.fromUserid = chat_records.fromUserid;
    this.toUserId = chat_records.toUserId;
    this.msg = chat_records.msg;
    this.recordDate = chat_records.recordDate;
    this.recordTime = chat_records.recordTime;
};


ChatRecords.getUserAllChatRecord = function getUserAllChatRecord(callback) {
		mongodb.collection('chat_records', function(err, collection) {
			if (err) {
				return callback(err);
			}

            var query = {
                userid: parseInt(params.userid)
            };

            var projection = {
                "msg_list":{"$slice":-10}
            };

//            db.chat_records.find({userid:1},{msg_list:{$slice:-2}}).sort({record_date:-1})

			collection.find(query,projection).sort({record_date:-1}).limit(1).toArray(function(err, docs) {
				if (err) {
					callback(err, null);
				}

				var Chat_Records = {};

				if(docs){
					docs.forEach(function(doc, index) {
                        Chat_Records = doc;
					});
                    callback(null, Chat_Records);
				}
			});
		});
};


ChatRecords.save = function save(callback){

    var chat_record = {
        userid:parseInt(this.userid),
        record_date:this.recordDate,
        msg:this.msg,
        from_userid:parseInt(this.fromUserid),
        to_userid:parseInt(this.toUserId),
        record_time:this.record_time
    }


    mongodb.collection('chat_records', function(err, collection) {
        if (err) {
            return callback(err);
        }

        var query = {
            userid: parseInt(chat_record.userid),
            record_date:chat_record.record_date
        };

        collection.findOne(query).toArray(function(err, docs) {
            if(docs){
                collection.update({record_date:chat_record.record_date},
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
                    "record_date" : chat_record.record_date,
                    "msg_list" : [
                    {
                        "record_time" : chat_record.record_time,
                        "msg" : chat_record.msg,
                        "from_userid" : chat_record.from_userid,
                        "to_userid" : chat_record.to_userid
                    }
                ]
               };

                collection.insert(insert_chart, {safe: true}, function (err, user) {
                    callback(err, insert_chart);//成功！返回插入的信息
                });
            }
        });
    });
};

module.exports = ChatRecords;