//数据库接口库
 var util = require('util');
var sqlite3 = require('sqlite3').verbose();

var db = undefined;

exports.connect = function (callback) {
    db = new sqlite3.Database(__dirname+"/../dev.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        function(err){
            if (err){
                if(callback)
                callback(err);
            } else {
                if(callback)
                callback(null);
            }
        });
};

exports.disconnect = function (callback) {
    db.close();
    if(callback)
        callback();
};

exports.add = function(table, obj, callback) {
    var fields = [];
    var values = [];
    var i = 0;
    for(var key in obj) {
        fields[i] = key;
        values[i] = obj[key];
        i++;
    }

    var sql = util.format('INSERT into %s (`%s`) values ("%s")', table, fields.join('`,`'), values.join('","'));
    db.exec(sql, function(err) {
            util.log(sql);
            if(err) {
                if(callback) {
                    callback(error);
                }
            } else {
                if(callback)
                    callback(null);
            }
    });
};
/**
 * 不开放删除数据库入口
 */
//exports.drop = function(table, callback) {
//    var sql = util.format("drop table %s", table);
//    db.run(sql,function(err) {
//        if(err) {
//            if (callback) {
//                callback(error);
//            }
//        }
//    });
//};
/**
 *
 * @param table
 * @param obj
 * @param where String 类型
 * @param callback
 */
exports.update = function (table, obj , where, callback) {
    var arr = [], i = 0;

    for(var key in obj) {
        arr[i++] = util.format("%s=%s", key, obj[key]);
    }

    var sql = util.format("UPDATE %s set %s", table, arr.join(','));
    if(where) {
        sql = util.format("%s where %s", sql, where);
    }
    db.exec(sql, function (err) {
        if(callback) {
            callback(err);
        } else {
            callback();
        }
    });
};

exports.delete = function (table, where, callback) {
    var sql = util.format("DELETE from %s", table);
    if(where) {
        sql = util.format("%s where %s", sql, where)
    }

    db.exec(sql, function(err) {
        if(err) {
            if(callback) {
                callback(err);
            }
        } else {
            if(callback) {
                callback(null);
            }
        }
    });
};
exports.findBy = function (table,where,callback) {
    var sql = util.format("SELECT * from %s",table);
    if(where) {
        sql = util.format("%s where %s", sql, where);
    }
    db.all(sql, function (err, rows) {
        util.log(sql);
        if(err) {
            if(callback)
                callback(err);
        } else {
            util.log(rows);

            if(callback) {
                callback(err,row);
            }
        }
    });
}
exports.find = function(table, fields, where, callback) {
    var sql = util.format("SELECT %s from %s", fields.join(','), table);
    if(where) {
        sql = util.format("%s where %s", sql, where);
    }
    db.all(sql, function (err, rows) {
        util.log(sql);
        if(err) {
            if(callback)
                callback(err);
        } else {
            if(callback) {
                callback(err,rows);
            }
        }
    });
};