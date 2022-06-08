const helper = require('../helper.js');
const DifficultyDao = require('./difficultyDao.js');
const ChallengeTagDao = require('./challengetagDao.js');
const CategoryDao = require('./categoryDao.js');
const HintDao = require('./hintDao.js');
const md5 = require('md5');
const { result } = require('lodash');
const { param } = require('express/lib/request');

class ChallengeDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadByIdUnsterilized(id) {
        const difficultyDao = new DifficultyDao(this._conn);
        const challengetagDao = new ChallengeTagDao(this._conn);
        const categoryDao = new CategoryDao(this._conn);
        const hintDao = new HintDao(this._conn);

        var sql = 'SELECT * FROM Challenge WHERE ChallengeID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);    
        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);
        result = helper.objectKeysToLower(result);
        
        // Get time
        var dt = helper.parseSQLDateTimeString(result.creationdate);
        result.creationdate = helper.formatToGermanDateTime(dt)

        // Get userdata
        var sql = 'SELECT * FROM User WHERE UserID=?';
        var statement = this._conn.prepare(sql);
        var user = statement.get(result.userid);
        if (helper.isUndefined(user)) 
            throw new Error('No user found by id=' + id);
        user = helper.objectKeysToLower(user);
        result.user = {
            username: user.username,
            userid: user.userid,
            userimage: user.picturepath
        }
        if (helper.isEmpty(result.user.userimage))
            result.user.userimage = helper.defaultData("profile");
        delete result.userid;

        result.difficulty = difficultyDao.loadById(result.difficultyid);
        delete result.difficultyid;
        result.tags = challengetagDao.loadByParent(result.challengeid);
        result.category = categoryDao.loadById(result.categoryid).title;
        result.hints = hintDao.loadAllByChallengeId(id);
        delete result.solution; // It is hashed and useless anyways

        return result;
    }

    loadById(id){
        var result = this.loadByIdUnsterilized(id);
        delete result.hints;
        return result;
    }

    loadAll() {
        const difficultyDao = new DifficultyDao(this._conn);
        var difficulties = difficultyDao.loadAll();
        const challengetagDao = new ChallengeTagDao(this._conn);
        const categoryDao = new CategoryDao(this._conn);

        var sql = 'SELECT * FROM Challenge';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result))
            return [];

        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            // Get difficulty level
            for (var element of difficulties) {
                if (element.difficultyid == result[i].difficultyid) {
                    result[i].difficulty = element.level;
                    break;
                }
            }
            delete result[i].difficultyid;
            
            // Get userdata
            var sql = 'SELECT * FROM User WHERE UserID=?';
            var statement = this._conn.prepare(sql);
            var user = statement.get(result[i].userid);

            if (helper.isUndefined(user)) 
                throw new Error('No user found by id=' + id);
            
            user = helper.objectKeysToLower(user);
            var dt = helper.parseSQLDateTimeString(result[i].creationdate);
            result[i].creationdate = helper.formatToGermanDateTime(dt)

            // Resolve ids
            if (helper.isEmpty(user.picturepath)) {user.picturepath = helper.defaultData("profile");}
            result[i].user = {
                username: user.username,
                userid: user.userid,
                userimage: user.picturepath
            }
            delete result[i].userid;

            result[i].tags = challengetagDao.loadByParent(result[i].challengeid);
            result[i].category = categoryDao.loadById(result[i].categoryid).title;

            // Do not leak challenge pw
            delete result[i].solution;
        }
        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(ChallengeID) AS cnt FROM Challenge WHERE ChallengeID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;
        return false;
    }

    create(userid, challengename = 'Challengename', difficultyid = 1, categoryid = 0, tags = [], description = '', hint1= '', hint2 = '', hint3 = '', password = '', creationdate = '') {       
        var sql = 'INSERT INTO Challenge (ChallengeName, DifficultyID, CategoryID, Description, CreationDate, Solution, UserID) VALUES (?,?,?,?,?,?,?)';
        var statement = this._conn.prepare(sql);

        var params = [challengename, Number(difficultyid), Number(categoryid), description, helper.formatToSQLDateTime(creationdate), md5(password), Number(userid)];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, challengename = '',  description = '', solution = '', difficultyid = '', categoryid = '') {
        var sql = 'UPDATE Challenge SET Challengename=?, Description=?';
        var params = [challengename, description];
        if (!helper.isEmpty(solution)){
            sql += ", Solution=?";
            params.push(solution);
        }
        if (!helper.isEmpty(difficultyid)){
            sql += ", DifficultyID=?";
            params.push(difficultyid);
        }
        if (!helper.isEmpty(categoryid)){
            sql += ", CategoryID=?";
            params.push(categoryid);
        }
        sql += " WHERE ChallengeID=?";
        params.push(id);
        var statement = this._conn.prepare(sql);
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Challenge WHERE ChallengeID=?';
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1) 
                throw new Error('Could not delete Record by id=' + id);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + id + '. Reason: ' + ex.message);
        }
    }

    toString() {
        helper.log('ChallengeDao [_conn=' + this._conn + ']');
    }
}

module.exports = ChallengeDao;
