var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var DbUtil = require('../dbUtil');
var router = express.Router();
var app = express();
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var dbUtil = new DbUtil();
var roleCollection = "role";

//列表页
router.get('/list', function (req, res) {
   dbUtil.find(roleCollection,{},function (result) {
        res.render('role/list', { list: result});
    });
})


//名称唯一校验
router.post('/checkName', urlencodedParser, function (req, res) {
    var whereJson = {name:req.body.name};   // 查询条件
    dbUtil.find(roleCollection,whereJson,function (result) {
        res.json({"flag":result.length>0});
    });
})

//添加页
router.get('/add', function(req, res) {
    app.use(express.static('public'));
    res.render('role/add',{ item: result[0]});
});

//添加
router.post('/add', urlencodedParser, function (req, res) {
    var addJson ={
        name:req.body.name
    };
    dbUtil.insertOne(roleCollection,addJson,function (result) {
        res.redirect(302, '/role/list');
    });
})

//修改页
router.get('/update', function(req, res) {
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    var ObjectID = require('mongodb').ObjectID;
    var whereJson = {_id:ObjectID(params.id)};   // 查询条件
    dbUtil.find(roleCollection,whereJson,function (result) {
        res.render('role/update',{ item: result[0]});
    });
});

//修改
router.post('/update', urlencodedParser, function (req, res) {
    var ObjectID = require('mongodb').ObjectID;
    var whereJson = {_id:ObjectID(req.body.id)};
    var updateStr = {$set: {
            name:req.body.name
        }};
    dbUtil.updateOne(roleCollection,whereJson,updateStr,function (result) {
        res.redirect(302, '/role/list');
    });
})

//删除
router.get('/del', function (req, res) {
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    var ObjectID = require('mongodb').ObjectID;
    var whereJson = {_id:ObjectID(params.id)};  // 条件
    dbUtil.deleteOne(roleCollection,whereJson,function (result) {
        res.redirect(302, '/role/list');
    });
})

module.exports = router;
