var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.createTable('user', {
		id: {type: 'int', primaryKey: true, autoIncrement: true , unique: true},
		name: { type: type.STRING, notNull: true, unique: true },
		password: { type: type.STRING, notNull: true },
		email: { type: type.STRING, notNull: true, unique: true }
	}, callback);

};

exports.down = function(db, callback) {
	db.dropTable('user', callback)
};
