const helper = require('../helper.js');

class DifficultyDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM Difficulty WHERE DifficultyID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);

        return result;
    }

    loadAll() {;
        var sql = 'SELECT * FROM Difficulty';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        return helper.arrayObjectKeysToLower(result);

    }

    exists(id) {
        var sql = 'SELECT COUNT(DifficultyID) AS cnt FROM Difficulty WHERE DifficultyID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;
        return false;
    }

    create(level = '', coins = '') {
        var sql = 'INSERT INTO Difficulty (Level, Coins) VALUES (?,?)';
        var statement = this._conn.prepare(sql);
        var params = [level, coins];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, level = '', coins = '') {
        var sql = 'UPDATE Difficulty SET Level=?, Coins=? WHERE DifficultyID=?';
        var statement = this._conn.prepare(sql);
        var params = [level, coins];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }


    delete(id) {
        try {
            var sql = 'DELETE FROM Difficulty WHERE DifficultyID=?';
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
        helper.log('DifficultyDao [_conn=' + this._conn + ']');
    }
}

module.exports = DifficultyDao;
