const helper = require('../helper.js');
const DifficultyDao = require('./difficultyDao.js');

class ChallengeDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const difficultyDao = new DifficultyDao(this._conn);

        var sql = 'SELECT * FROM Challenge WHERE ChallengeID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);

        var dt = helper.parseSQLDateTimeString(result.creationdate);
        result.creationdate = helper.formatToGermanDateTime(dt)

        result.difficulty = difficultyDao.loadById(result.difficultyid);
        delete result.difficultyid;

        return result;
    }

    loadAll() {
        const difficultyDao = new DifficultyDao(this._conn);
        var difficulties = difficultyDao.loadAll();

        var sql = 'SELECT * FROM Challenge';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result))
            return [];

        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            for (var element of difficulties) {
                if (element.difficultyid == result[i].difficultyid) {
                    result[i].difficulty = element.level;
                    break;
                }
            }
            delete result[i].difficultyid;
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

    create(challengename = '', description = '', creationdate = '', solution = '', difficultyid = null) {
        const difficultyDao = new DifficultyDao(this._conn);
        
        var sql = 'INSERT INTO Person (Challengename, Description, CreationDate, Solution, CountryID) VALUES (?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [challengename, description, helper.formatToSQLDateTime(creationdate), solution, difficultyDao.loadById(result.difficultyid)];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, challengename = '',  description = '', creationdate = '', solution = '', difficultyid = null) {
        var sql = 'UPDATE Challenge SET Challengename=?, Description=?, CreationDate=?, Solution=?, CountryID=? WHERE ChallengeID=?)';
        var statement = this._conn.prepare(sql);
        var params = [challengename, description, helper.formatToSQLDateTime(creationdate), solution, difficultyDao.loadById(result.difficultyid)];
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
