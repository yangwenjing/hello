var express = require('express');
var router = express.Router();

var data = {
  active: "home",
};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', data);
  console.log("index...");
});

module.exports = router;
