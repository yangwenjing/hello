/**
 * Created by ywj on 15/7/22.
 */
var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    var data = {title: 'login', username: ''};
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
