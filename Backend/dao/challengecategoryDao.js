const helper = require('../helper.js');

class ChallengeCategoryDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM ChallengeCategory WHERE ChallengeCategoryID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);

        result.challenge = challengeDao.loadById(result.challengeid);
        delete result.challengeid;

        result.category = categoryDao.loadById(result.categoryid);
        delete result.categoryid;

        return result;
    }

    loadAll() {;
        const challengeDao = new ChallengeDao(this._conn);
        var challenges = challengeDao.loadAll();

        const categoryDao = new CategoryDao(this._conn);
        var categorys = categoryDao.loadAll();

        var sql = 'SELECT * FROM ChallengeCategory';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        result = helper.arrayObjectKeysToLower(result);

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
            for (var element of categorys) {
                if (element.id == result[i].categoryid) {
                    result[i].category = element;
                    break;
                }
            }
            delete result[i].categoryid;
        }
        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(ChallengeCategoryID) AS cnt FROM Bestellposition WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1)
            return true;

        return false;
    }

    create(challengeid = '', categoryid = '') {
        var sql = 'INSERT INTO ChallengeCategory (ChallengeID, CategoryID) VALUES (?,?)';
        var statement = this._conn.prepare(sql);
        var params = [challengeid, categoryid];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, challengeid = '', categoryid = '') {
        var sql = 'UPDATE ChallengeCategory SET ChallengeID=?, CategoryID=? WHERE ChallengeCategoryID=?';
        var statement = this._conn.prepare(sql);
        var params = [challengeid, categoryid];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }


    delete(id) {
        try {
            var sql = 'DELETE FROM ChallengeCategory WHERE ChallengeCategoryID=?';
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
        helper.log('ChallengeCategoryDao [_conn=' + this._conn + ']');
    }
}

module.exports = ChallengeCategoryDao;
