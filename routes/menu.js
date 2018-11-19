var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var DbUtil = require('../dbUtil');
var router = express.Router();
var app = express();
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var dbUtil = new DbUtil();
var menuCollection = "menu";

//树页
router.get('/tree', function(req, res) {
    app.use(express.static('public'));
    res.render('menu/tree');
});

//树页
router.post('/getMenu', function(req, res) {
    res.json({treeList:req.session.menu});
});

//节点
router.post('/getTreeNode', function (req, res) {
    var whereJson = {parent:"0"};
    dbUtil.find(menuCollection,whereJson,function (rootChildren) {
        var whereJson = {parent:{$ne:"0"}};
        dbUtil.find(menuCollection,whereJson,function (treeChildren) {
            res.json({rootChildren:rootChildren,treeChildren:treeChildren});
        });
    });
})

//添加页
router.get('/add', function(req, res) {
    app.use(express.static('public'));
    // 解析 url 参数
    var params = url.parse(req.url,true).query;
    res.render('menu/add',{parent:params.id});
});

//添加
router.post('/add', urlencodedParser, function (req, res) {
    var addJson ={
        name:req.body.name,
        url:req.body.url,
        type:req.body.type,
        icon:req.body.icon,
        parent:req.body.parent,
        order:req.body.order
    };
    dbUtil.insertOne(menuCollection,addJson,function (result) {
        res.redirect(302, '/menu/tree');
    });
})

//修改页
router.get('/update', function(req, res) {
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    var ObjectID = require('mongodb').ObjectID;
    var whereJson = {_id:ObjectID(params.id)};   // 查询条件
    dbUtil.find(menuCollection,whereJson,function (result) {
        res.render('menu/update',{ item: result[0]});
    });
});

//修改
router.post('/update', urlencodedParser, function (req, res) {
    var ObjectID = require('mongodb').ObjectID;
    var whereJson = {_id:ObjectID(req.body.id)};
    var updateStr = {$set: {
            name:req.body.name,
            url:req.body.url,
            type:req.body.type,
            icon:req.body.icon,
            parent:req.body.parent,
            order:req.body.order
        }};
    dbUtil.updateOne(menuCollection,whereJson,updateStr,function (result) {
        res.redirect(302, '/menu/tree');
    });
})

//删除
router.get('/del', function (req, res) {
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    var ObjectID = require('mongodb').ObjectID;
    var whereJson = {_id:ObjectID(params.id)};  // 条件
    dbUtil.deleteOne(menuCollection,whereJson,function (result) {
        res.redirect(302, '/menu/tree');
    });
})

module.exports = router;
