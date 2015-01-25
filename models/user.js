var mongodb = require('./db');

function User(user) {
	this.userid = user.userid;
	this.username = user.username;
	this.password = user.password;
	this.name = user.name;
};

/**
 * 保存
 * @param callback
 */
User.save = function save(callback) {
	console.log("保存username::"+this.username);

	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.insert(user, {safe: true}, function(err, user) {
				mongodb.close();
				callback(err, user);
			});
		});
	});
}

/**
 * 查询
 * @param username
 * @param callback
 */
User.get = function get(user, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			collection.findOne({username: user.username,password:user.password}, function(err, doc) {
				mongodb.close();
				if (doc) {
					var user = new User(doc);
					callback(err, user);
				} else {
					callback(err, null);
				}
			});
		});
	});
};


User.getAllUser = function getAllUser(callback) {



	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('users', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			var query = {};

			collection.find(query).sort({userid: 1}).toArray(function(err, docs) {
				db.close();
				if (err) {
					db.close();
					callback(err, null);
				}

				var user_arr = [];
				docs.forEach(function(doc, index) {
					user_arr.push(doc);
				});
				callback(null, user_arr);
			});
		});
	});
};


User.getAllFriends = function getAllFriends(callback) {
	if(!mongodb.openCalled){
		mongodb.open(function(err, db) {
			if (err) {
				return callback(err);
			}

			db.collection('users', function(err, collection) {
				if (err) {
					return callback(err);
				}
				var query = {
					"friends": 1
				};

				collection.find({userid:1},query).sort({userid: 1}).toArray(function(err, docs) {
					if (err) {
						callback(err, null);
					}

					var friend_arr = {};
					docs.forEach(function(doc, index) {
						friend_arr = doc.friends;
					});
					callback(null, friend_arr);
				});
			});
		});
	}
	else{
		mongodb.collection('users', function(err, collection) {
			if (err) {
				return callback(err);
			}
			var query = {
				"friends": 1,
				"groups":1
			};

			collection.find({userid:1},query).sort({userid: 1}).toArray(function(err, docs) {
				if (err) {
					callback(err, null);
				}

				var result = {};
				docs.forEach(function(doc, index) {
					result = doc;
				});

				callback(null, result);
			});
		});
	}


};




module.exports = User;