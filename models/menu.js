var mongodb = require('./db');

function Menu(menu) {
	this.name = menu.name;
	this.url = menu.url;
	this.id = menu.id;
};

/**
 * 保存
 * @param callback
 */
Menu.save = function save(callback) {
	console.log("保存name::"+this.name);

	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('menus', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			collection.insert(menu, {safe: true}, function(err, menu) {
				db.close();
				callback(err, menu);
			});
		});
	});
}

/**
 * 查询
 * @param username
 * @param callback
 */
Menu.get = function get(menu, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('menus', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}

			collection.findOne({name: menu.name}, function(err, doc) {
				db.close();
				if (doc) {
					var user = new Menu(doc);
					callback(err, user);
				} else {
					callback(err, null);
				}
			});
		});
	});
};



Menu.getAllMenu = function getAll(callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('menus', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			var query = {};

			collection.find(query).sort({id: 1}).toArray(function(err, docs) {
				db.close();
				if (err) {
					callback(err, null);
				}

				var menus = [];
				docs.forEach(function(doc, index) {
					menus = doc.menus;
				});
				callback(null, menus);
			});
		});
	});
};

module.exports = Menu;