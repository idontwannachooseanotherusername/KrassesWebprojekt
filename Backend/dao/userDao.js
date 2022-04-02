const md5 = require('md5');
const helper = require('../helper.js');
const CountryDao = require('./countryDao.js');

class UserDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const countryDao = new CountryDao(this._conn);

        var sql = 'SELECT * FROM User WHERE UserID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);

        result.country = countryDao.loadById(result.countryid).countryname;
        delete result.countryid;

        return result;
    }

    loadAll() {
        const countryDao = new CountryDao(this._conn);
        var countries = countryDao.loadAll();

        var sql = 'SELECT * FROM User';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {          
            for (var element of countries) {
                if (element.id == result[i].countryid).countryname {
                    result[i].country = element;
                    break;
                }
            }
            delete result[i].countryid;
        }
        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(UserID) AS cnt FROM User WHERE UserID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;
        return false;
    }

    create(username = '', password = '', bio = '', picturepath = '', bannerpath = '', countryid = null, points = 0) {
        const countryDao = new CountryDao(this._conn);
        
        var sql = 'INSERT INTO Person (Username, Password, Bio, PicturePath, BannerPath, CountryID, Points) VALUES (?,?,?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [username, md5(password), bio, picturepath, countryDao.loadById(result.countryid), points];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, username = '', newpassword = null, oldpassword = null, bio = '', picturepath = '', bannerpath = '', countryid = null, points = 0) {
        if (helper.isNull(newpassword)) {
            var sql = 'UPDATE User SET Username=?,Bio=?,PicturePath=?,BannerPath=?,CountryID=?,Points=? WHERE UserID=?';
            var params = [username, bio, picturepath, bannerpath, countryid, points, id];
        } else{
            var sql = 'UPDATE User SET Username=?,Password=?,Bio=?,PicturePath=?,BannerPath=?,CountryID=?,Points=? WHERE UserID=?';
            var result_t = this.loadById(id) // Check if old passwords match
            if (result_t.password == md5(oldpassword)){
                var params = [username, md5(newpassword), bio, picturepath, bannerpath, countryid, points, id];
            }
            else{
                throw new Error('Old passwords do not match - userid:' + id);
            }
        }
        var statement = this._conn.prepare(sql);
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not update existing Record. Data: ' + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM User WHERE UserID=?';
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
        helper.log('UserDao [_conn=' + this._conn + ']');
    }
}

module.exports = UserDao;
