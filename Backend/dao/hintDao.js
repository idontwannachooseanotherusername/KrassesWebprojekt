const helper = require('../helper.js');
const ChallengeDao = require('./challengeDao.js');

class HintDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM Hint WHERE HintID=?';
        // TODO: "Cannot read property 'prepare' of undefined" ???
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);
        delete result.challengeid;

        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(HintID) AS cnt FROM Hint WHERE HintID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;
        return false;
    }

    create(description = '', cost = '',challengeid = null) {
        var sql = 'INSERT INTO Hint (Description, Cost, ChallengeID) VALUES (?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [description, cost, challengeDao.loadById(result.challengeid)];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, description = '', cost = '',challengeid = null) {
        var sql = 'UPDATE Hint SET Description=?, Cost=? ,ChallengeID=? WHERE HintID=?';
        var statement = this._conn.prepare(sql);
        var params = [description, cost, challengeid];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }


    delete(id) {
        try {
            var sql = 'DELETE FROM Hint WHERE HintID=?';
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
        helper.log('HintDao [_conn=' + this._conn + ']');
    }
}

module.exports = HintDao;
