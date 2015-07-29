var express = require('express');
var router = express.Router();

var data = {
  active: "users"
};
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('intro', data);
});
module.exports = router;
