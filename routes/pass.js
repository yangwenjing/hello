/**
 * Created by ywj on 15/7/29.
 */
var express = require('express');
var router = express.Router();

var data = {
    active: "users"
};
/* GET users listing. */
function requireLogin (req, res, next) {
    if(req.session.user) {
        next();
    } else {
        req.session.error = "Access denied!";
        res.redirect('/login');
    }
}
/**
 * 验证数据库中是否存在某用户
 * @param req
 * @param res
 * @param next
 */
function userExist(req, res, next) {

}


module.exports = router;