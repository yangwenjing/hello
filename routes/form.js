/**
 * Created by ywj on 15/7/22.
 */
var express = require('express');
var router = express.Router();
/* GET home page. */
var db = require('./sql.js');

var data = {
    active: "other"
};
router.get('/form', function(req, res, next) {
    console.log(db.name);
    data.subActive = "form";
    if(req.query.username)
        data.username = req.query.username;
    else {
        data.username = "";
    }
    if(req.query['username']=='admin')
    {
        data.status = 1;
    }
    res.render('form',data);
});
router.get('/ajax', function(req, res, next) {
    data.subActive = "ajax";
    if(req.query.username)
        data.username = req.query.username;
    if(req.query['username']=='admin')
    {
        data.status = 1;
    }
    res.render('form',data);
});
router.post('/', function(req, res) {
    res.send("yes");
});
module.exports = router;
