/**
 * Created by ywj on 15/7/29.
 */
var dbop = require('./sql.js');
dbop.connect();
var obj = {
    name: "user",
    password: "pppp",
    email: "yangwenjing@buaa.cn"
}
dbop.add('user',obj);
dbop.findBy('user');