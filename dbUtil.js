var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017';
var dbName = "mytest";

class DbUtil{
    create(collection) {
        MongoClient.connect(dburl,{ useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbase = db.db(dbName.toString());
            dbase.createCollection(collection, function (err, res) {
                if (err) throw err;
                console.log("创建集合"+collection);
                db.close();
            });
        });
    }

    find(collection,whereJson,callback) {
        MongoClient.connect(dburl,{ useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbase = db.db(dbName.toString());
            dbase.collection(collection.toString()). find(whereJson).toArray(function(err, result) {
                if (err) throw err;
                db.close();
                callback(result);
            });
        });
    }

    insertOne(collection,addJson,callback) {
        MongoClient.connect(dburl,{ useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbase = db.db(dbName.toString());
            dbase.collection(collection.toString()).insertOne(addJson,function(err, result) {
                if (err) throw err;
                db.close();
                callback(result);
            });
        });
    }

    updateOne(collection,whereJson,updateJson,callback) {
        MongoClient.connect(dburl,{ useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbase = db.db(dbName.toString());
            dbase.collection(collection.toString()).updateOne(whereJson,updateJson,function(err, result) {
                if (err) throw err;
                db.close();
                callback(result);
            });
        });
    }

    deleteOne(collection,whereJson,callback) {
        MongoClient.connect(dburl,{ useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbase = db.db(dbName.toString());
            dbase.collection(collection.toString()).deleteOne(whereJson,function(err, result) {
                if (err) throw err;
                db.close();
                callback(result);
            });
        });
    }
}
module.exports = DbUtil;
