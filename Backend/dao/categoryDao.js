const helper = require('../helper.js');

class CategoryDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM Category WHERE CategoryID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);

        return result;
    }

    loadAll() {;
        var sql = 'SELECT * FROM Category';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        return helper.arrayObjectKeysToLower(result);

    }

    exists(id) {
        var sql = 'SELECT COUNT(CategoryID) AS cnt FROM Category WHERE CategoryID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;
        return false;
    }

    create(description = '', cost = '') {
        var sql = 'INSERT INTO Category (Description, Cost) VALUES (?)';
        var statement = this._conn.prepare(sql);
        var params = [text];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, description = '', cost = '') {
        var sql = 'UPDATE Category SET Text=? WHERE CategoryID=?';
        var statement = this._conn.prepare(sql);
        var params = [text];
        var result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }


    delete(id) {
        try {
            var sql = 'DELETE FROM Category WHERE CategoryID=?';
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
        helper.log('CategoryDao [_conn=' + this._conn + ']');
    }
}

module.exports = CategoryDao;
