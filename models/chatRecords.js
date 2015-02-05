var mongodb = require('./db');

function ChatRecords(chat_records) {
	this.id = chat_records.id;
    this.fromUserid = chat_records.fromUserid;
    this.toUserId = chat_records.toUserId;
    this.msg = chat_records.msg;
    this.recordDate = chat_records.recordDate;
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

			collection.find(query,projection).sort({record_date:-1}).toArray(function(err, docs) {
				if (err) {
					callback(err, null);
				}

				var ChatRooms = [];

				if(docs){
					docs.forEach(function(doc, index) {
                        ChatRooms.push(doc);
					});

                    callback(null, ChatRooms);
				}

			});
		});
};

module.exports = ChatRoom;