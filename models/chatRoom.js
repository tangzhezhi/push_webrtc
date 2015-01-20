var mongodb = require('./db');

function ChatRoom(char_room) {
	this.id = char_room.id;
	this.name = char_room.name;
	this.subject = char_room.subject;
	this.current_num = char_room.current_num;
};


ChatRoom.getAllChatRoom = function getAll(callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}

		mongodb.Db;

		db.collection('chat_rooms', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			var query = {};

			collection.find(query).sort({id: 1}).toArray(function(err, docs) {
				db.close();
				if (err) {
					db.close();
					callback(err, null);
				}

				var ChatRooms = [];
				docs.forEach(function(doc, index) {
					ChatRooms = doc.chat_rooms;
				});
				callback(null, ChatRooms);
			});
		});
	});
};

module.exports = ChatRoom;