var express = require('express');
var router = express.Router();

var db = require('../db');

router.get('/join', function (req, res, next) {
    res.render('join', { title: 'join' });
    var userId = req.body['userId'];
    var userPw = req.body['userPw'];
    var userPwRe = req.body['userPwRe'];
    if (userPw == userPwRe) {
        db.query('insert into author values(?,?)', [userId, userPw], function (err, rows, fields) {
            if (!err) {
                res.send('success');
            } else {
                res.send('err : ' + err);
            }
        });
    }else{
        res.send('password not match!');
    }
});

module.exports = router;

