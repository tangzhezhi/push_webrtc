var mongodb = require('./db');

function ChatRoom(char_room) {
	this.id = char_room.id;
	this.name = char_room.name;
	this.subject = char_room.subject;
	this.current_num = char_room.current_num;
};


ChatRoom.getAllChatRoom = function getAll(callback) {
	if(!mongodb.openCalled){
		mongodb.open(function(err, db) {
			if (err) {
				return callback(err);
			}
			db.collection('chat_rooms', function(err, collection) {
				if (err) {
					return callback(err);
				}
				var query = {};

				collection.find(query).sort({id: 1}).toArray(function(err, docs) {
					if (err) {
						callback(err, null);
					}

					var ChatRooms = [];
                    if(docs){
                        docs.forEach(function(doc, index) {
                            ChatRooms = doc.chat_room;
                        });

                        callback(null, ChatRooms);
                    }
				});
			});
		});
	}
	else{
		mongodb.collection('chat_rooms', function(err, collection) {
			if (err) {
				return callback(err);
			}
			var query = {};

			collection.find(query).toArray(function(err, docs) {
				if (err) {
					callback(err, null);
				}

				var ChatRooms = [];

				if(docs){
					docs.forEach(function(doc, index) {
                        ChatRooms = doc.chat_room;
					});

                    callback(null, ChatRooms);
				}

			});
		});
	}


};

module.exports = ChatRoom;