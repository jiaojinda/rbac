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
var roleMenuCollection = "role-menu";


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
    res.render('role/add');
});

//添加
router.post('/add', urlencodedParser, function (req, res) {
    var addJson ={
        name:req.body.name
    };
    dbUtil.insertOne(roleCollection,addJson,function (result) {
        var roleId = result.ops[0]._id;
        var menuArr=req.body.menuStr.split(',');
        if(menuArr.length>0){
            var ObjectID = require('mongodb').ObjectID;
            var menuJsonObj = [];
            for(var i = 0;i<menuArr.length;i++){
                var menuJson ={
                    roleId:roleId,
                    menuId:ObjectID(menuArr[i])
                };
                menuJsonObj.push(menuJson);
            }
            dbUtil.insertMany(roleMenuCollection,menuJsonObj,function () {
                res.redirect(302, '/role/list');
            });
        }
    });
})

//修改页
router.get('/update', function(req, res) {
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    var ObjectID = require('mongodb').ObjectID;
    var roleId = ObjectID(params.id);
    var whereJson = {_id:roleId};   // 查询条件
    dbUtil.find(roleCollection,whereJson,function (result) {
        var menuWhereJson = {roleId:roleId};
        dbUtil.find(roleMenuCollection,menuWhereJson,function (menuResult) {
            var menuArr = [];
            for(var i=0;i<menuResult.length;i++){
                menuArr.push(menuResult[i].menuId);
            }
            res.render('role/update',{ item: result[0],menuArr:menuArr.toString()});
        });
    });
});

//修改
router.post('/update', urlencodedParser, function (req, res) {
    var ObjectID = require('mongodb').ObjectID;
    var roleId = ObjectID(req.body.id);
    var whereJson = {_id:roleId};
    var updateStr = {$set: {
            name:req.body.name
        }};
    dbUtil.updateOne(roleCollection,whereJson,updateStr,function () {
        var menuWhereJson = {roleId:roleId};
        dbUtil.deleteMany(roleMenuCollection,menuWhereJson,function () {
            var menuArr=req.body.menuStr.split(',');
            if(menuArr.length>0){
                var roleJsonObj = [];
                for(var i = 0;i<menuArr.length;i++){
                    var roleJson ={
                        roleId:roleId,
                        menuId:ObjectID(menuArr[i])
                    };
                    roleJsonObj.push(roleJson);
                }
                dbUtil.insertMany(roleMenuCollection,roleJsonObj,function () {
                    res.redirect(302, '/role/list');
                });
            }
        });
    });
})

//删除
router.get('/del', function (req, res) {
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    var ObjectID = require('mongodb').ObjectID;
    var roleId = ObjectID(params.id);
    var whereJson = {_id:roleId};  // 条件
    dbUtil.deleteOne(roleCollection,whereJson,function () {
        var menuWhereJson = {roleId:roleId};
        dbUtil.deleteMany(roleMenuCollection,menuWhereJson,function () {
            res.redirect(302, '/role/list');
        });
    });
})

module.exports = router;
