const helper = require('../helper.js');

class ChallengeFileDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM ChallengeFile WHERE ChallengeFileID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);

        result.challenge = challengeDao.loadById(result.challengeid);
        delete result.challengeid;

        result.file = fileDao.loadById(result.fileid);
        delete result.fileid;

        return result;
    }

    loadAll() {;
        const challengeDao = new ChallengeDao(this._conn);
        var challenges = challengeDao.loadAll();

        const fileDao = new FileDao(this._conn);
        var files = fileDao.loadAll();

        var sql = 'SELECT * FROM ChallengeFile';
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
            for (var element of files) {
                if (element.id == result[i].fileid) {
                    result[i].file = element;
                    break;
                }
            }
            delete result[i].fileid;
        }
        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(ChallengeFileID) AS cnt FROM Bestellposition WHERE ID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1)
            return true;

        return false;
    }

    create(challengeid = '', fileid = '') {
        var sql = 'INSERT INTO ChallengeFile (ChallengeID, FileID) VALUES (?,?)';
        var statement = this._conn.prepare(sql);
        var params = [challengeid, fileid];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, challengeid = '', fileid = '') {
        var sql = 'UPDATE ChallengeFile SET ChallengeID=?, FileID=? WHERE ChallengeFileID=?';
        var statement = this._conn.prepare(sql);
        var params = [challengeid, fileid];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }


    delete(id) {
        try {
            var sql = 'DELETE FROM ChallengeFile WHERE ChallengeFileID=?';
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
        helper.log('ChallengeFileDao [_conn=' + this._conn + ']');
    }
}

module.exports = ChallengeFileDao;
