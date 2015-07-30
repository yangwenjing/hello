var express = require('express');
var router = express.Router();
var db = require('./sql.js');
var util = require('util');
var data = {
  active: "users"
};
/* GET users listing. */
function User(name, password, email) {
  this.name = name ? name : "";
  this.password = password ? password : "";
  this.email = email ? password : "";
}
var table = "user";
function createUser (user, callback) {
  db.connect();
  db.add(table, user, callback);
  db.disconnect();
}


router.get('/', function(req, res, next) {
  if(!req.query.user && !data.user) {
    data.user = new User();
  }
  res.render('intro', data);
});
router.get('/register', function(req, res, next) {
  if(!req.query.user) {
    data.user = new User();
  }

  res.render('register', data);
});

router.post('/register', function(req, res, next) {

  data.user.name = req.body.username;
  data.user.email = req.body.email;
  data.user.password = req.body.password;
  createUser(data.user, function (err) {
    if(err) {
      res.redirect('/users/register');
    }
    else {
      res.redirect('/');
    }
  });
});

module.exports = router;
