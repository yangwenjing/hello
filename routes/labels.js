/**
 * Created by ywj on 15/7/30.
 */
var express = require('express');
var router = express.Router();
var db = require('./sql.js');
var util = require('util');
var data = {
    active: "label",
    labels: selectAllLabels(),
};

var table = 'label';


function selectAllLabels () {
    db.connect();
    db.find('label',['name'],null,function (err, row) {
        if(err) {
            data.labels = [];
            return;
        }
        if(row) {
            data.labels = row;
        }
    });
    db.disconnect();
}


router.get('/', function(req, res, next) {
    selectAllLabels ();
    res.render('MyLabels', data);
});

function addLabels(names) {
    db.connect();
    for(var key in names) {
        db.add(table,{name:names[key]});
        util.log("adding");
    }
    db.disconnect();
}

router.post('/',function(req, res, next) {
    var names = req.body.names.split(',');
    addLabels(names);
    res.redirect('/labels');
});

module.exports = router;