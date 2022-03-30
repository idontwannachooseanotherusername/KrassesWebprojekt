const helper = require('../helper.js');

class TagDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM Tag WHERE TagID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);

        return result;
    }

    loadAll() {;
        var sql = 'SELECT * FROM Tag';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        return helper.arrayObjectKeysToLower(result);

    }

    exists(id) {
        var sql = 'SELECT COUNT(ID) AS cnt FROM Tag WHERE TagID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;
        return false;
    }

    create(picturepath = '', title = '') {
        var sql = 'INSERT INTO Tag (Picturepath, Title) VALUES (?,?)';
        var statement = this._conn.prepare(sql);
        var params = [picturepath, title];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, picturepath = '', title = '') {
        var sql = 'UPDATE Tag SET Picturepath=?, Title=? WHERE TagID=?';
        var statement = this._conn.prepare(sql);
        var params = [picturepath, title];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }


    delete(id) {
        try {
            var sql = 'DELETE FROM Tag WHERE TagID=?';
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
        helper.log('TagDao [_conn=' + this._conn + ']');
    }
}

module.exports = TagDao;
