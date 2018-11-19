var express = require('express');
var bodyParser = require('body-parser');
var md5 =require("md5");
var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var DbUtil = require('../dbUtil');
var userCollection = "user";
var userRoleCollection = "user-role";
var roleMenuCollection = "role-menu";
var menuCollection = "menu";
var dbUtil = new DbUtil();


/* GET home page. */
router.get('/', function(req, res) {
    if(req.session==undefined||req.session.user==undefined){
        res.render('login',{ message: '' });
    }else{
        res.render('index');
    }
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

//登陆
router.post('/login', urlencodedParser, function (req, res) {
    var password = md5(req.body.password+"salt");
    var whereJson = {account:req.body.account};   // 查询条件
    dbUtil.find(userCollection,whereJson,function (result) {
        if(result[0].password==password){
            req.session.user= {userName:result[0].name,userId:result[0]._id};
            dbUtil.find(userRoleCollection,{userId: result[0]._id},function (roleIdResule) {
                var roleIdArr = [];
                for(var i=0;i<roleIdResule.length;i++){
                    roleIdArr.push(roleIdResule[i].roleId);
                }
                dbUtil.find(roleMenuCollection,{roleId: {$in:roleIdArr}},function (menuIdResule) {
                    var menuIdArr = [];
                    for(var i=0;i<menuIdResule.length;i++){
                        menuIdArr.push(menuIdResule[i].menuId);
                    }
                    dbUtil.find(menuCollection,{_id: {$in:menuIdArr}},function (menuResule) {
                        req.session.menu=menuResule;
                        res.redirect(302, '/');
                    });
                });
            });
        }else{
            res.render('login', { message: '账号或密码不正确' });
        }
    });
})


module.exports = router;
