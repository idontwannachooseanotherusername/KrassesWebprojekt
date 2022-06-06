const md5 = require('md5');
const helper = require('../helper.js');
const CountryDao = require('./countryDao.js');
const ChallengeDao = require('./challengeDao.js');
const webtoken = require('../webtoken/index.js');

class UserDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const countryDao = new CountryDao(this._conn);
        const challengeDao = new ChallengeDao(this._conn);

        var sql = 'SELECT * FROM User WHERE UserID=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result = helper.objectKeysToLower(result);

        // Country and bio
        if (result.countryid != null){
            result.country = countryDao.loadById(result.countryid).countryname;
        }
        else{
            result.country = helper.defaultDataPath("country");
        }
        delete result.countryid;

        if (result.bio == ""){
            result.bio = helper.defaultDataPath("bio");
        }

        // Get last 10 solved challenges
        var sql = 'SELECT * FROM Solved';
        var statement = this._conn.prepare(sql);
        var result_solved = statement.all();
        var dt = helper.parseSQLDateTimeString(result_solved.ts);
        result_solved.ts = helper.formatToGermanDateTime(dt)

        if (helper.isArrayEmpty(result_solved)) 
            return [];

        result_solved = helper.arrayObjectKeysToLower(result_solved);
        
        var solved_list = [];
        for (var solved of result_solved){
            if (solved.userid == result.userid){
                delete solved.userid;
                solved.challengename = challengeDao.loadById(solved.challengeid).challengename;
                solved_list.push(solved);

                if (solved_list.length >= 10){break;}
            }
        }
        result.solved = solved_list;

        // Get last 10 created challenges
        var created_list = [];
        for (var e of challengeDao.loadAll()){
            if (e.userid == result.userid){
                created_list.push({
                    challengeid: e.challengeid,
                    challengename: e.challengename,
                    ts: e.creationdate
                });

                if (created_list.length >= 10){break;}
            }
        }
        result.created = created_list;

        // Strip user password
        delete result.password;

        // Add default images
        if (result.bannerpath == "") {result.bannerpath = helper.defaultDataPath("banner");}
        if (result.picturepath == "") {result.picturepath = helper.defaultDataPath("profile");}

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
            // Countries can be empty(null)
            if (result[i].countryid != null){
                for (var element of countries) {
                    if (element.countryid == result[i].countryid.countryname) {
                        result[i].country = element;
                        break;
                    }
                }
                delete result[i].countryid;
            }
            // Strip user password
            delete result[i].password;
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

    username_exists(username=''){
        var sql = 'SELECT * FROM User WHERE Username=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(username);

        if (result == undefined){return false};
        return helper.arrayObjectKeysToLower(result);
    }

    create(username = '', password = '', bio = '', picturepath = '', bannerpath = '', countryid = null, points = 0, deleted = 0) {
        const countryDao = new CountryDao(this._conn);

        // Login user if username exists and pw matches
        var user = this.username_exists(username);
        if (user != false){
            if (md5(password) === user.Password){
                return webtoken.generate(username, user.UserID);
            }
            else{
                // TODO: Do not throw error, show string in frontend that pw does not match
                throw new Error('No user found with username: ' + username);
            }
        }
        
        var sql = 'INSERT INTO User (Username, Password, Bio, PicturePath, BannerPath, CountryID, Points, Deleted) VALUES (?,?,?,?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [username, md5(password), bio, picturepath, bannerpath, countryid, points, deleted];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return webtoken.generate(username, newObj.userid);
    }

    update(id, username = '', newpassword = null, oldpassword = null, bio = '', picturepath = '', bannerpath = '', countryid = undefined) {
        if (helper.isNull(newpassword)) {
            var sql = 'UPDATE User SET Username=?,Bio=?,PicturePath=?,BannerPath=?,CountryID=? WHERE UserID=?';
            var params = [username, bio, picturepath, bannerpath, countryid, points, id];
        } else{
            var sql = 'UPDATE User SET Username=?,Password=?,Bio=?,PicturePath=?,BannerPath=?,CountryID=? WHERE UserID=?';
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
