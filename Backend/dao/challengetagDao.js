const helper = require('../helper.js');
const TagDao = require('../dao/tagDao.js');
const { response } = require('express');

class ChallengeTagDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadByTagId(id) {
        var sql = 'SELECT * FROM ChallengeTag WHERE TagID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);
        const tagDao = new TagDao(this._conn);

        for (var i = 0; i < result.length; i++){
            result[i] = tagDao.loadById(result.tagid);
        }
        return result;
    }

    loadByChallengeId(id) {
        var sql = 'SELECT * FROM ChallengeTag WHERE ChallengeID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);
        const tagDao = new TagDao(this._conn);

        for (var i = 0; i < result.length; i++){
            result[i] = tagDao.loadById(result.tagid);
        }
        return result;
    }
    
    loadByParent(challengeid) {
        const tagDao = new TagDao(this._conn);
        var tags = tagDao.loadAll();

        var sql = 'SELECT * FROM ChallengeTag WHERE challengeID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(challengeid);

        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            for (var element of tags){
                if (element.tagid == result[i].tagid){
                    result[i] = element;
                    break;
                }
            }
            delete result[i].challengeid;
        }
        return result;
    }

    loadAll() {;
        const tagDao = new TagDao(this._conn);
        var tags = tagDao.loadAll();

        var sql = 'SELECT * FROM ChallengeTag';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        result = helper.arrayObjectKeysToLower(result);
        console.log(result);

        for (var i = 0; i < result.length; i++) {
            for (var element of tags) {
                if (element.tagid == result[i].tagid) {
                    result[i].tag = element;
                    break;
                }
            }
            delete result[i].tagid;
        }
        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(ChallengeTagID) AS cnt FROM Bestellposition WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1)
            return true;

        return false;
    }

    create(challengeid = '', tagid = '') {
        var sql = 'INSERT INTO ChallengeTag (ChallengeID, TagID) VALUES (?,?)';
        var statement = this._conn.prepare(sql);
        var params = [challengeid, tagid];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);
    }

    update(id, challengeid = '', tagid = '') {
        var sql = 'UPDATE ChallengeTag SET ChallengeID=?, TagID=? WHERE ChallengeTagID=?';
        var statement = this._conn.prepare(sql);
        var params = [challengeid, tagid];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }


    delete(id) {
        try {
            var sql = 'DELETE FROM ChallengeTag WHERE ChallengeTagID=?';
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1) 
                throw new Error('Could not delete Record by id=' + id);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + id + '. Reason: ' + ex.message);
        }
    }

    deleteByChallengeId(id) {
        try {
            var sql = 'DELETE FROM ChallengeTag WHERE ChallengeID=?';
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1)
                console.log('challengeTagDao - Could not delete records with challengeID=' + id + ". Records might have been deleted already.")
                // throw new Error('Could not delete Records with challengeid=' + id);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Records with challengeid=' + id + '. Reason: ' + ex.message);
        }
    }

    toString() {
        helper.log('ChallengeTagDao [_conn=' + this._conn + ']');
    }
}

module.exports = ChallengeTagDao;
