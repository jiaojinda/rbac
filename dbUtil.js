var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var config =require('./dbConfig');
var dbUrl = config.dbUrl;
var dbName = config.dbName;

class DbUtil{
    //创建库
    create(collection) {
        MongoClient.connect(dbUrl,{ useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbase = db.db(dbName.toString());
            dbase.createCollection(collection, function (err, res) {
                if (err) throw err;
                console.log("创建集合"+collection);
                db.close();
            });
        });
    }
    //查询
    find(collection,whereJson,callback) {
        MongoClient.connect(dbUrl,{ useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbase = db.db(dbName.toString());
            dbase.collection(collection.toString()). find(whereJson).toArray(function(err, result) {
                if (err) throw err;
                db.close();
                callback(result);
            });
        });
    }
    //关联查询
    aggregate(collectionLeft,collectionRigeh,localField,foreignField,as,whereJson,callback) {
        MongoClient.connect(dbUrl,{ useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName.toString());
            dbo.collection(collectionLeft.toString()).aggregate([
                { $lookup:
                        {
                            from: collectionRigeh.toString(),            // 右集合
                            localField:localField.toString(),    // 左集合 join 字段
                            foreignField: foreignField.toString(),         // 右集合 join 字段
                            as: as.toString()           // 新生成字段（类型array）
                        }
                },{$unwind:"$"+as.toString()},{ $match : whereJson}
            ]).toArray(function(err, result) {
                if (err) throw err;
                db.close();
                callback(result);
            });
        });
    }
    //插入单条
    insertOne(collection,addJson,callback) {
        MongoClient.connect(dbUrl,{ useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbase = db.db(dbName.toString());
            dbase.collection(collection.toString()).insertOne(addJson,function(err, result) {
                if (err) throw err;
                db.close();
                callback(result);
            });
        });
    }
    //插入多条
    insertMany(collection,addJsonObj,callback) {
        MongoClient.connect(dbUrl,{ useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName.toString());
            dbo.collection(collection.toString()).insertMany(addJsonObj, function(err, result) {
                if (err) throw err;
                db.close();
                callback(result);
            });
        });
    }
    //修改
    updateOne(collection,whereJson,updateJson,callback) {
        MongoClient.connect(dbUrl,{ useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbase = db.db(dbName.toString());
            dbase.collection(collection.toString()).updateOne(whereJson,updateJson,function(err, result) {
                if (err) throw err;
                db.close();
                callback(result);
            });
        });
    }
    //删除单条
    deleteOne(collection,whereJson,callback) {
        MongoClient.connect(dbUrl,{ useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbase = db.db(dbName.toString());
            dbase.collection(collection.toString()).deleteOne(whereJson,function(err, result) {
                if (err) throw err;
                db.close();
                callback(result);
            });
        });
    }
    //删除多条
    deleteMany(collection,whereJson,callback) {
        MongoClient.connect(dbUrl,{ useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbase = db.db(dbName.toString());
            dbase.collection(collection.toString()).deleteMany(whereJson,function(err, result) {
                if (err) throw err;
                db.close();
                callback(result);
            });
        });
    }
}
module.exports = DbUtil;
