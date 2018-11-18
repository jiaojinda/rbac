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
var roleCollection = "role";
var userRoleCollection = "user-role";
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
    dbUtil.find(roleCollection,{},function (result) {
        res.render('user/add', { list: result});
    });
});

//添加
router.post('/add', urlencodedParser, function (req, res) {
    var password = md5(req.body.password+"salt");
    var userJson ={
        account:req.body.account,
        password:password,
        name:req.body.name,
        sex:req.body.sex
    };
    dbUtil.insertOne(userCollection,userJson,function (result) {
        var userId = result.ops[0]._id;
        var roleArr=req.body.roleStr.split(',');
        if(roleArr.length>0){
            var ObjectID = require('mongodb').ObjectID;
            var roleJsonObj = [];
            for(var i = 0;i<roleArr.length;i++){
                var roleJson ={
                    userId:userId,
                    roleId:ObjectID(roleArr[i])
                };
                roleJsonObj.push(roleJson);
            }
            dbUtil.insertMany(userRoleCollection,roleJsonObj,function () {
                res.redirect(302, '/user/list');
            });
        }
    });
})

//修改页
router.get('/update', function(req, res) {
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    var ObjectID = require('mongodb').ObjectID;
    var userId = ObjectID(params.id);
    var whereJson = {_id:userId};   // 查询条件
    dbUtil.find(userCollection,whereJson,function (result) {
        var roleWhereJson = {userId:userId};
        dbUtil.find(roleCollection,{},function (roleresult) {
            dbUtil.find(userRoleCollection,roleWhereJson,function (userRoleresult) {
                var haveRoleList = new Array();
                var haventRoleList = new Array();
                for(var i=0;i<roleresult.length;i++){
                    var flag = false;
                    for(var j=0;j<userRoleresult.length;j++){
                        if(roleresult[i]._id.toString()==userRoleresult[j].roleId.toString()){
                            flag = true;
                            break;
                        }
                    }
                    if(flag){
                        haveRoleList.push(roleresult[i]);
                    }else{
                        haventRoleList.push(roleresult[i]);
                    }
                }
                res.render('user/update',{ item: result[0],haveRoleList:haveRoleList,haventRoleList:haventRoleList});
            });
        });
    });
});

//修改
router.post('/update', urlencodedParser, function (req, res) {
    var ObjectID = require('mongodb').ObjectID;
    var userId = ObjectID(req.body.id);
    var whereJson = {_id:userId};
    var updateStr = {$set: {
            name:req.body.name,
            sex:req.body.sex
        }};
    dbUtil.updateOne(userCollection,whereJson,updateStr,function () {
        var roleWhereJson = {userId:userId};
        dbUtil.deleteMany(userRoleCollection,roleWhereJson,function () {
            var roleArr=req.body.roleStr.split(',');
            if(roleArr.length>0){
                var roleJsonObj = [];
                for(var i = 0;i<roleArr.length;i++){
                    var roleJson ={
                        userId:userId,
                        roleId:ObjectID(roleArr[i])
                    };
                    roleJsonObj.push(roleJson);
                }
                dbUtil.insertMany(userRoleCollection,roleJsonObj,function () {
                    res.redirect(302, '/user/list');
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
    var userId = ObjectID(params.id)
    var whereJson = {_id:userId};  // 条件
    dbUtil.deleteOne(userCollection,whereJson,function () {
        var roleWhereJson = {userId:userId};
        dbUtil.deleteMany(userRoleCollection,roleWhereJson,function () {
            res.redirect(302, '/user/list');
        });
    });
})

module.exports = router;
