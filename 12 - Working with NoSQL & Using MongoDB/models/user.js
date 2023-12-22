const path = require('path');
const mongodb = require('mongodb');

const rootDirectoryStr = path.dirname(require.main.filename);
const mongoDatabase = require(path.join(rootDirectoryStr, 'util', 'mongoDBCreds.js'));
const getDB = mongoDatabase.getDB;

class User {
    constructor(argsObj) {
        this.username = argsObj.username;
        this.email = argsObj.email;

        if (argsObj._id)
            this._id = argsObj._id;
    }

    save() {
        const db = getDB();
        const argsObj = this._getArgsObj();

        if (argsObj._id) {
            return this.constructor._updateUser(db, argsObj);
        
        } else {
            return this.constructor._insertUser(db, argsObj);
        }
    }

    _getArgsObj() {
        const argsObj = {
            username: this.username,
            email: this.email
        };

        if (this._id)
            argsObj['_id'] = this._id;

        return argsObj;
    }

    static _updateUser(db, argsObj) {
        const mongoIDObj = new mongodb.ObjectId(argsObj._id);
        const filterObj = { _id: mongoIDObj };
        const updateObj = { $set: argsObj };

        return db.collection('users').updateOne(filterObj, updateObj);
    }

    static _insertUser(db, argsObj) {
        return db.collection('users').insertOne(argsObj);
    }

    static findById(userID) {
        const db = getDB();
        const mongoIDObj = new mongodb.ObjectId(userID);
        
        return db.collection('users')
        .findOne({ _id: mongoIDObj })
        .then(mongoUser => this._getUser(mongoUser));
    }

    static _getUser(mongoUser) {
        if (!mongoUser) return null;
        
        const argsObj = {
            username: mongoUser.username,
            email: mongoUser.email
        };

        if (mongoUser._id)
            argsObj['_id'] = mongoUser._id;

        return argsObj;
    }

    static deleteById(userID) {
        const db = getDB();
        const mongoIDObj = new mongodb.ObjectId(userID);
        
        return db.collection('users').deleteOne({ _id: mongoIDObj });
    }
}

module.exports = User;