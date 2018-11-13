var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var md5 =require("md5");
var DbUtil = require('../dbUtil');
var router = express.Router();
var app = express();
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var dbUtil = new DbUtil();
var userCollection = "user";
//列表页
router.get('/list', function (req, res) {
   dbUtil.find(userCollection,{},function (result) {
        res.render('user/list', { list: result});
    });
})


//账号唯一校验
router.post('/checkAccount', urlencodedParser, function (req, res) {
    var whereJson = {account:req.body.account};   // 查询条件
    dbUtil.find(userCollection,whereJson,function (result) {
        res.json({"flag":result.length>0});
    });
})

//添加页
router.get('/add', function(req, res) {
    app.use(express.static('public'));
    res.render('user/add');
});

//添加
router.post('/add', urlencodedParser, function (req, res) {
    var password = md5(req.body.password+"salt");
    var addJson ={
        account:req.body.account,
        password:password,
        name:req.body.name,
        sex:req.body.sex
    };
    dbUtil.insertOne(userCollection,addJson,function (result) {
        res.redirect(302, '/user/list');
    });
})

//修改页
router.get('/update', function(req, res) {
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    var ObjectID = require('mongodb').ObjectID;
    var whereJson = {_id:ObjectID(params.id)};   // 查询条件
    dbUtil.find(userCollection,whereJson,function (result) {
        res.render('user/update',{ item: result[0]});
    });
});

//修改
router.post('/update', urlencodedParser, function (req, res) {
    var ObjectID = require('mongodb').ObjectID;
    var whereJson = {_id:ObjectID(req.body.id)};
    var updateStr = {$set: {
            name:req.body.name,
            sex:req.body.sex
        }};
    dbUtil.updateOne(userCollection,whereJson,updateStr,function (result) {
        res.redirect(302, '/user/list');
    });
})

//删除
router.get('/del', function (req, res) {
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    var ObjectID = require('mongodb').ObjectID;
    var whereJson = {_id:ObjectID(params.id)};  // 条件
    dbUtil.deleteOne(userCollection,whereJson,function (result) {
        res.redirect(302, '/user/list');
    });
})

module.exports = router;
