const helper = require('../helper.js');
const ChallengeDao = require('../dao/challengeDao.js');
const UserDao = require('../dao/userDao.js');

class SolvedDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const challengeDao = new ChallengeDao(this._conn);
        const userDao = new UserDao(this._conn);

        var sql = 'SELECT * FROM Solved WHERE SolvedID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);

        /* NOT NEEDED
        result.challenge = challengeDao.loadById(result.challengeid);
        delete result.challengeid;

        result.user = userDao.loadById(result.userid);
        delete result.userid;
        */

        var dt = helper.parseSQLDateTimeString(result.ts);
        result.ts = helper.formatToGermanDateTime(dt)

        return result;
    }

    loadAll() {;
        const challengeDao = new ChallengeDao(this._conn);
        var challenges = challengeDao.loadAll();

        const userDao = new UserDao(this._conn);
        var users = userDao.loadAll();

        var sql = 'SELECT * FROM Solved';
        var statement = this._conn.prepare(sql);
        var result = statement.all();
        var dt = helper.parseSQLDateTimeString(result.ts);
        result.ts = helper.formatToGermanDateTime(dt)

        if (helper.isArrayEmpty(result)) 
            return [];

        result = helper.arrayObjectKeysToLower(result);

        /* NOT NEEDED
        for (var i = 0; i < result.length; i++) {
            for (var element of challenges) {
                if (element.id == result[i].challengeid) {
                    result[i].challenge = element;
                    break;
                }
            }
            delete result[i].challengeid;
        }

        for (var i = 0; i < result.length; i++) {
            for (var element of users) {
                if (element.id == result[i].userid) {
                    result[i].user = element;
                    break;
                }
            }
            delete result[i].userid;
        }
        */
        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(SolvedID) AS cnt FROM Bestellposition WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1)
            return true;

        return false;
    }

    create(challengeid = '', userid = '',ts = '') {
        var sql = 'INSERT INTO Solved (ChallengeID, UserID, Ts) VALUES (?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [challengeid, userid, helper.formatToSQLDateTime(ts)];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, challengeid = '', userid = '',ts = '') {
        var sql = 'UPDATE Solved SET ChallengeID=?, UserID=?, Ts=? WHERE SolvedID=?';
        var statement = this._conn.prepare(sql);
        var params = [challengeid, userid, helper.formatToSQLDateTime(ts)];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }


    delete(id) {
        try {
            var sql = 'DELETE FROM Solved WHERE SolvedID=?';
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
        helper.log('SolvedDao [_conn=' + this._conn + ']');
    }
}

module.exports = SolvedDao;
