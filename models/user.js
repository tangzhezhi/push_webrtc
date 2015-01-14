var mongodb = require('./db');

function User(user) {
	this.username = user.username;
	this.password = user.password;
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

module.exports = User;