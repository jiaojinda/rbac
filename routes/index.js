var express = require('express');
var router = express.Router();
var DbUtil = require('../dbUtil');
var dbUtil = new DbUtil();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//创建库
router.get('/init', function (req, res) {
    dbUtil.create("user");
    dbUtil.create("user-role");
    dbUtil.create("role");
    dbUtil.create("role-menu");
    dbUtil.create("menu");
    res.send('数据库已创建');
})

module.exports = router;
